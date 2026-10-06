import { Request, Response } from "express";
import * as friendsServices from "../services/friendshipsServices";
import { directionSchema, idSchema } from "@flock/shared/schemas/common";
import { getUserById } from "../services/usersServices";
import { validate } from "../utils/validate";
import { NotFoundError } from "../utils/errors";

export async function getMyFriends(req: Request, res: Response) {
  const userId = validate(idSchema, req.user.id, "Invalid user ID");

  const user = await getUserById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

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

// Send request
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

  const friendship = await friendsServices.getFriendship(
    requesterId,
    requesteeId,
  );

  if (!friendship) {
    throw new NotFoundError("Friend request not found");
  }

  const updatedFriendship = await friendsServices.updateFriendship(friendship);

  res.status(200).json({ status: "Success", data: updatedFriendship });
}

export async function deleteFriendship(req: Request, res: Response) {
  const userId = validate(idSchema, req.user.id, "Invalid user ID");
  const friendId = validate(idSchema, req.body.friendId, "Invalid user ID");

  const friend = await getUserById(friendId);
  if (!friend) {
    throw new NotFoundError("User not found");
  }

  // check if friendship exists
  const friendship = await friendsServices.getFriendship(userId, friendId);

  if (!friendship) {
    throw new NotFoundError("Friendship not found");
  }

  friendsServices.deleteFriendship(friendship);

  res.status(200).json({ status: "Success", message: " Friendship deleted" });
}
