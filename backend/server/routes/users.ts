import { Router } from "express";
import { prisma } from "../prisma";
import { idSchema } from "../../../shared/schemas/common";
import { createUserSchema, editUserSchema } from "../../../shared/schemas/user";
import { getUserById, publicUserInformationSelect } from "../utils/prismaUtils";
import { handleZodError } from "../utils/errorHandlers";

export const usersRouter = Router();

// GET ALL user accounts
usersRouter.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ status: "Success", data: users });
  } catch (error) {
    res.status(500).json({ status: "Error", error: "Internal server error" });
  }
});

// GET specific user account
usersRouter.get("/:userId", async (req, res) => {
  try {
    const id = idSchema.parse(req.params.userId);
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ status: "Error", error: "User not found" });
    }

    res.status(200).json({ status: "Success", data: user });
  } catch (error) {
    handleZodError(error, res);

    res.status(500).json({ status: "Error", error: "Internal server error" });
  }
});

// Endpoints for to get a users friends list
usersRouter.get("/:userId/friends", async (req, res) => {
  try {
    const userId = idSchema.parse(req.params.userId);
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ status: "Error", error: "User not found" });
    }

    const friends = await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: userId }, { requesteeId: userId }],
      },
      include: {
        requester: {
          select: publicUserInformationSelect,
        },
        requestee: {
          select: publicUserInformationSelect,
        },
      },
    });

    const friendsInfo = friends.map((friends) =>
      friends.requesterId === userId ? friends.requestee : friends.requester,
    );

    res.status(200).json({ status: "Success", data: friendsInfo });
  } catch (error) {
    handleZodError(error, res);
    res.status(500).json({ status: "Error", error: "Internal server error" });
  }
});

// CREATE user, only for a debug purposes
usersRouter.post("/", async (req, res) => {
  try {
    const data = createUserSchema.parse(req.body);
    const user = await prisma.user.create({
      data,
    });
    res.status(201).json({ status: "Success", data: user });
  } catch (error) {
    handleZodError(error, res);
    res.status(500).json({ status: "Error", error: "Internal server error" });
  }
});
