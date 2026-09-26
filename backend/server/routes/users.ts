import { Router } from "express";
import { prisma } from "../prisma";
import { idSchema } from "../../../shared/schemas/common";
import { createUserSchema, editUserSchema } from "../../../shared/schemas/user";
export const usersRouter = Router();
import { getUserById } from "../utils/prismaUtils";
import { z, ZodError } from "zod";
import { handleZodError } from "../utils/errorHandlers";

// get ALL users
usersRouter.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ status: "Success", data: users });
  } catch (error) {
    res.status(500).json({ status: "Error", error: "Internal server error" });
  }
});

// GET specific user
usersRouter.get("/:userID", async (req, res) => {
  try {
    const id = idSchema.parse(req.params.userID);
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

// CREATE user, only forc a debug purposes
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

// DELETE user account
usersRouter.delete("/:userID", async (req, res) => {
  try {
    const id = idSchema.parse(req.params.userID);
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ status: "Error", error: "User not found" });
    }

    // Add authorisation

    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ status: "Success", message: "User deleted" });
  } catch (error) {
    handleZodError(error, res);
    res.status(500).json({ status: "Error", error: "Internal server error" });
  }
});

// Edit user account
usersRouter.patch("/:userID", async (req, res) => {
  try {
    const id = idSchema.parse(req.params.userID);
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return res.status(404).json({ status: "Error", error: "User not found" });
    }

    // add authorisation

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

// Endpoints for users friends

usersRouter.get("/:userID/friends", async (req, res) => {
  try {
    const userId = idSchema.parse(req.params.userID);
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
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        requestee: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
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

usersRouter.get("/:userID/friend_requests/sent", async (req, res) => {
  try {
    const userId = idSchema.parse(req.params.userID);
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ status: "Error", error: "User not found" });
    }

    const requests = await prisma.friendship.findMany({
      where: {
        status: "PENDING",
        requesterId: userId,
      },
      include: {
        requestee: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
      },
    });

    res
      .status(200)
      .json({ status: "Success", data: requests.map((r) => r.requestee) });
  } catch (error) {
    handleZodError(error, res);
    res.status(500).json({ status: "Error", error: "Internal server error" });
  }
});
usersRouter.get("/:userID/friend_requests/received", async (req, res) => {
  try {
    const userId = idSchema.parse(req.params.userID);
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ status: "Error", error: "User not found" });
    }

    const requests = await prisma.friendship.findMany({
      where: {
        status: "PENDING",
        requesteeId: userId,
      },
      include: {
        requester: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
      },
    });

    res
      .status(200)
      .json({ status: "Success", data: requests.map((r) => r.requester) });
  } catch (error) {
    handleZodError(error, res);
    res.status(500).json({ status: "Error", error: "Internal server error" });
  }
});
