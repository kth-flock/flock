import { Request, Response } from "express";
import * as usersServices from "../services/usersServices";
import * as friendshipsServices from "../services/friendshipsServices";
import { idSchema } from "@flock/shared/schemas/common";
import { searchUsersQuerySchema } from "@flock/shared/schemas/user";
import { validate } from "../utils/validate";
import { NotFoundError } from "../utils/errors";

export async function getUsers(req: Request, res: Response) {
  const users = await usersServices.getUsers();
  res.status(200).json({ status: "Success", data: users });
}

export async function getUser(req: Request, res: Response) {
  const userId = validate(idSchema, req.params.userId, "Invalid user ID");

  const user = await usersServices.getUserById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.status(200).json({ status: "Success", data: user });
}

export async function getUserFriends(req: Request, res: Response) {
  const userId = validate(idSchema, req.params.userId, "Invalid user ID");

  const user = await usersServices.getUserById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const friendsInfo = await friendshipsServices.getAllFriends(userId);

  res.status(200).json({ status: "Success", data: friendsInfo });
}

export async function searchUsers(req: Request, res: Response) {
  const parsedQuery = validate(
    searchUsersQuerySchema,
    req.query,
    "Invalid request",
  );

  const userId = validate(idSchema, req.user.id, "Invalid user ID");

  const data = await usersServices.searchUsers(userId, parsedQuery.query);

  res.status(200).json({ status: "Success", data: data });
}
