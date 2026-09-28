import { Router } from "express";
import { prisma } from "../prisma";
import { idSchema } from "../../../shared/schemas/common";
import { publicUserInformationSelect } from "../utils/selectors";
import { getUser, getUsers } from "../controllers/usersController";
import { getAllFriends } from "../services/friendshipsServices";

export const usersRouter = Router();

usersRouter.get("/", getUsers); // GET ALL user accounts
usersRouter.get("/:userId", getUser); // GET specific user account
usersRouter.get("/:userId/friends", getAllFriends); // Endpoints for to get a users friends list
