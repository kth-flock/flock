import { Request, Response } from "express";
import * as usersServices from "../services/usersServices";
import * as friendshipsServices from "../services/friendshipsServices";
import * as eventsService from "../services/eventsService";
import { idSchema } from "@flock/shared/schemas/common";
import { searchUsersQuerySchema } from "@flock/shared/schemas/user";
import { validate } from "../utils/validate";

export async function getUser(req: Request, res: Response) {
  const userId = validate(idSchema, req.params.userId, "Invalid user ID");

  const user = await usersServices.getUserProfile(userId);

  res.status(200).json({ status: "Success", data: user });
}

export async function getUserFriends(req: Request, res: Response) {
  const userId = validate(idSchema, req.params.userId, "Invalid user ID");

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

export async function getEventsTogether(req: Request, res: Response) {
  const myId = validate(idSchema, req.user.id, "Invalid user ID");
  const otherId = validate(idSchema, req.params.userId, "Invalid user ID");

  const events = await eventsService.getEventsTogether(myId, otherId);

  res.status(200).json({ status: "Success", data: events });
}
