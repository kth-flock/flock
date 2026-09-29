import { Router } from "express";
import {
  getUser,
  getUserFriends,
  getUsers,
} from "../controllers/usersController";

export const usersRouter = Router();

usersRouter.get("/", getUsers); // GET ALL user accounts
usersRouter.get("/:userId", getUser); // GET specific user account
usersRouter.get("/:userId/friends", getUserFriends); // Endpoints for to get a users friends list
