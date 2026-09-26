import { Router } from "express";
import { prisma } from "../prisma";
import { idSchema } from "../../../shared/schemas/common";
import { createUserSchema } from "../../../shared/schemas/user";
import { getFriends, getUserById } from "../utils/prismaUtils";
import { handleRouteError } from "../utils/errorHandlers";

export const usersRouter = Router();

// GET ALL user accounts
usersRouter.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ status: "Success", data: users });
  } catch (error) {
    return handleRouteError(error, res);
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
    return handleRouteError(error, res);
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
    const friendsInfo = await getFriends(idSchema.parse(userId));
    console.log(friendsInfo);
    res.status(200).json({ status: "Success", data: friendsInfo });
  } catch (error) {
    return handleRouteError(error, res);
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
    return handleRouteError(error, res);
  }
});
function getAcceptedFriends(arg0: number) {
  throw new Error("Function not implemented.");
}
