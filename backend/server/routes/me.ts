import { Router } from "express";
import { prisma } from "../prisma";
import { idSchema } from "../../../shared/schemas/common";
import {
  privateUserInformationSelect,
  getUserById,
} from "../utils/prismaUtils";
import { editUserSchema } from "../../../shared/schemas/user";
import { friendshipsRouter } from "./friendships";

export const meRouter = Router();

meRouter.use("/friendships", friendshipsRouter);

// GET my account
meRouter.get("/", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: privateUserInformationSelect,
  });

  if (!user) {
    return res.status(404).json({ status: "Error", error: "User not found" });
  }

  res.status(200).json({ status: "Success", data: user });
});

// DELETE my user account
meRouter.delete("/", async (req, res) => {
  const result = idSchema.safeParse(req.user.id);
  if (!result.success) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }
  const id = result.data;
  const user = await getUserById(id);
  if (!user) {
    return res.status(404).json({ status: "Error", error: "User not found" });
  }

  await prisma.user.delete({
    where: { id },
  });
  res.status(200).json({ status: "Success", message: "User deleted" });
});

// Edit my user account
meRouter.patch("/", async (req, res) => {
  const result = idSchema.safeParse(req.user.id);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }
  const id = result.data;

  const existingUser = await getUserById(id);
  if (!existingUser) {
    return res.status(404).json({ status: "Error", error: "User not found" });
  }

  const data = editUserSchema.parse(req.body);

  const updatedUser = await prisma.user.update({
    where: { id },
    select: privateUserInformationSelect,
    data,
  });

  res.status(200).json({
    status: "Success",
    message: "User information successfully edited",
    data: updatedUser,
  });
});
