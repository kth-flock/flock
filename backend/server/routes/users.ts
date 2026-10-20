import { Router } from "express";
import {
  getUser,
  getUserFriends,
  getEventsTogether,
  searchUsers,
} from "../controllers/usersController";

export const usersRouter = Router();

usersRouter.get("/search", searchUsers); // Endpoints for user search with friend status
usersRouter.get("/:userId", getUser);
usersRouter.get("/:userId/friends", getUserFriends);
usersRouter.get("/:userId/events-together", getEventsTogether); // Upcoming and past events users both take part in
