import { Router } from "express";
import { prisma } from "../prisma";
import { idSchema } from "../../../shared/schemas/common";
import {
  privateUserInformationSelect,
  getUserById,
} from "../utils/prismaUtils";
import { handleZodError } from "../utils/errorHandlers";
import { editUserSchema } from "../../../shared/schemas/user";
import { friendshipsRouter } from "./friendships";

export const meRouter = Router();

meRouter.use("/friendships", friendshipsRouter);

// GET my account
meRouter.get("/", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: privateUserInformationSelect,
    });

    if (!user) {
      return res.status(404).json({ status: "Error", error: "User not found" });
    }

    res.status(200).json({ status: "Success", data: user });
  } catch (error) {
    res.status(500).json({ status: "Error", error: "Internal server error" });
  }
});

// DELETE my user account
meRouter.delete("/", async (req, res) => {
  try {
    const id = idSchema.parse(req.user.id);
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ status: "Error", error: "User not found" });
    }

    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ status: "Success", message: "User deleted" });
  } catch (error) {
    handleZodError(error, res);
    res.status(500).json({ status: "Error", error: "Internal server error" });
  }
});

// Edit my user account
meRouter.patch("/", async (req, res) => {
  try {
    const id = idSchema.parse(req.user.id);
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return res.status(404).json({ status: "Error", error: "User not found" });
    }

    const data = editUserSchema.parse(req.body);

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    res.status(200).json({
      status: "Success",
      message: "User information successfully edited",
      data: updatedUser,
    });
  } catch (error) {
    handleZodError(error, res);
    res.status(500).json({ status: "Error", error: "Internal server error" });
  }
});
