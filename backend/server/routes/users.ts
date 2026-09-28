import { Router } from "express";
import { prisma } from "../prisma";
import { idSchema } from "../../../shared/schemas/common";
import {
  getFriends,
  getUserById,
  publicUserInformationSelect,
} from "../utils/prismaUtils";

export const usersRouter = Router();

// GET ALL user accounts
usersRouter.get("/", async (req, res) => {
  const users = await prisma.user.findMany({
    select: publicUserInformationSelect,
  });
  res.status(200).json({ status: "Success", data: users });
});

// GET specific user account
usersRouter.get("/:userId", async (req, res) => {
  const result = idSchema.safeParse(req.params.userId);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }

  const user = await getUserById(result.data);

  if (!user) {
    return res.status(404).json({ status: "Error", error: "User not found" });
  }

  res.status(200).json({ status: "Success", data: user });
});

// Endpoints for to get a users friends list
usersRouter.get("/:userId/friends", async (req, res) => {
  const result = idSchema.safeParse(req.params.userId);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }

  const userId = result.data;
  const user = await getUserById(userId);

  if (!user) {
    return res.status(404).json({ status: "Error", error: "User not found" });
  }
  const friendsInfo = await getFriends(idSchema.parse(userId));

  res.status(200).json({ status: "Success", data: friendsInfo });
});
