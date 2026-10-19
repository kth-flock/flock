import { Router } from "express";
import {
  getUser,
  getUserFriends,
  getUsers,
  getEventsTogether,
  searchUsers,
} from "../controllers/usersController";
import { authMiddleware } from "../middleware/authMiddleware";

export const usersRouter = Router();

usersRouter.get("/", getUsers); // GET ALL user accounts
usersRouter.get("/search", authMiddleware, searchUsers); // Endpoints for user search with friend status
usersRouter.get("/:userId", getUser); // GET specific user account
usersRouter.get("/:userId/friends", getUserFriends); // Endpoints for to get a users friends list
usersRouter.get("/:userId/events-together", authMiddleware, getEventsTogether); // Upcoming events you and this user both take part in
