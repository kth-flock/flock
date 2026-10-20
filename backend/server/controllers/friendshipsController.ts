import { Request, Response } from "express";
import * as friendsServices from "../services/friendshipsServices";
import { directionSchema, idSchema } from "@flock/shared/schemas/common";
import { validate } from "../utils/validate";

export async function getMyFriends(req: Request, res: Response) {
  const userId = validate(idSchema, req.user.id, "Invalid user ID");

  const friendsInfo = await friendsServices.getAllFriends(userId);

  res.status(200).json({ status: "Success", data: friendsInfo });
}

export async function getFriendRequests(req: Request, res: Response) {
  const direction = validate(
    directionSchema,
    req.query.direction,
    "Invalid request",
  );

  const userId = validate(idSchema, req.user.id, "Invalid user ID");

  const friendshipRequests = await friendsServices.getFriendRequests(
    userId,
    direction,
  );

  res.status(200).json({ status: "Success", data: friendshipRequests });
}

export async function sendFriendRequest(req: Request, res: Response) {
  const requesterId = validate(idSchema, req.user.id, "Invalid user ID");
  const requesteeId = validate(
    idSchema,
    req.body.requesteeId,
    "Invalid user ID",
  );

  const request = await friendsServices.sendFriendRequest(
    requesterId,
    requesteeId,
  );
  res.status(201).json({
    status: "Success",
    message: "Friend request sent",
    data: request,
  });
}

export async function acceptFriendship(req: Request, res: Response) {
  const requesterId = validate(
    idSchema,
    req.body.requesterId,
    "Invalid user ID",
  );

  const requesteeId = validate(idSchema, req.user.id, "Invalid user ID");

  const updatedFriendship = await friendsServices.updateFriendship(
    requesterId,
    requesteeId,
  );

  res.status(200).json({ status: "Success", data: updatedFriendship });
}

export async function deleteFriendship(req: Request, res: Response) {
  const userId = validate(idSchema, req.user.id, "Invalid user ID");
  const friendId = validate(idSchema, req.body.friendId, "Invalid user ID");

  await friendsServices.deleteFriendship(userId, friendId);

  res.status(200).json({ status: "Success", message: " Friendship deleted" });
}
