import { Request, Response } from "express";
import * as usersServices from "../services/usersServices";
import * as friendshipsServices from "../services/friendshipsServices";
import { idSchema } from "@flock/shared/schemas/common";
import { searchUsersQuerySchema } from "@flock/shared/schemas/user";

export async function getUsers(req: Request, res: Response) {
  const users = await usersServices.getUsers();
  res.status(200).json({ status: "Success", data: users });
}

export async function getUser(req: Request, res: Response) {
  const result = idSchema.safeParse(req.params.userId);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }
  const user = await usersServices.getUserProfile(result.data);

  if (!user) {
    return res.status(404).json({ status: "Error", error: "User not found" });
  }

  res.status(200).json({ status: "Success", data: user });
}

export async function getUserFriends(req: Request, res: Response) {
  const result = idSchema.safeParse(req.params.userId);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }

  const userId = result.data;
  const user = await usersServices.getUserById(userId);

  if (!user) {
    return res.status(404).json({ status: "Error", error: "User not found" });
  }

  const friendsInfo = await friendshipsServices.getAllFriends(userId);

  res.status(200).json({ status: "Success", data: friendsInfo });
}

export async function searchUsers(req: Request, res: Response) {
  const parsedQuery = searchUsersQuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    return res.status(400).json({ status: "Error", error: "Invalid request" });
  }

  const data = await usersServices.searchUsers(
    req.user.id,
    parsedQuery.data.query,
  );
  res.status(200).json({ status: "Success", data: data });
}
