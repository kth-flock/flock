import { Router } from "express";
import { prisma } from "../prisma";
import { idSchema } from "../../../shared/schemas/common";
import { createUserSchema, editUserSchema } from "../../../shared/schemas/user";
export const usersRouter = Router();
import { getUserById } from "../utils/prismaUtils";
import { z } from "zod";

// get ALL users
usersRouter.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET specific user
usersRouter.get("/:userID", async (req, res) => {
  try {
    const id = idSchema.parse(req.params.userID);
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found", statusCode: 404 });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// CREATE user
usersRouter.post("/", async (req, res) => {
  try {
    const data = createUserSchema.parse(req.body);
    const user = await prisma.user.create({
      data,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// DELETE user account
usersRouter.delete("/:userID", async (req, res) => {
  try {
    const id = idSchema.parse(req.params.userID);
    const user = getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add authorisation

    await prisma.user.delete({
      where: { id },
    });
    res.json({ message: "User deleted" });
  } catch (error) {
    return res.status(404).json({ error: (error as Error).message });
  }
});

// Edit user account
usersRouter.patch("/:userID", async (req, res) => {
  try {
    const id = idSchema.parse(req.params.userID);
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // add authorisation

    const data = editUserSchema.parse(req.body);

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    res.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: (error as Error).message });
  }
});

// Endpoints for users friends

usersRouter.get("/:userID/friends", async (req, res) => {
  try {
    const userId = idSchema.parse(req.params.userID);
    const user = await getUserById;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
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

    res.json(friendsInfo);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

usersRouter.get("/:userID/friend_requests/sent", async (req, res) => {
  try {
    const userId = idSchema.parse(req.params.userID);
    const user = await getUserById;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
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

    res.json(requests.map((r) => r.requestee));
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
usersRouter.get("/:userID/friend_requests/received", async (req, res) => {
  try {
    const userId = idSchema.parse(req.params.userID);
    const user = await getUserById;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
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

    res.json(requests.map((r) => r.requester));
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
