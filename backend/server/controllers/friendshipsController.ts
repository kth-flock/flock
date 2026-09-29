import { Request, Response } from "express";
import * as friendsServices from "../services/friendshipsServices";
import { directionSchema, idSchema } from "@flock/shared/schemas/common";
import { getUserById } from "../services/usersServices";

export async function getMyFriends(req: Request, res: Response) {
  const result = idSchema.safeParse(req.user.id);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }

  const userId = result.data;
  const user = await getUserById(userId);

  if (!user) {
    return res.status(404).json({ status: "Error", error: "User not found" });
  }

  const friendsInfo = await friendsServices.getAllFriends(result.data);

  res.status(200).json({ status: "Success", data: friendsInfo });
}

export async function getFriendRequests(req: Request, res: Response) {
  const result = directionSchema.safeParse(req.query.direction);
  if (!result.success) {
    return res.status(400).json({
      error: "Invalid request",
    });
  }

  const direction = result.data;
  const userId = req.user.id; // might need to be type checked

  const friendshipRequests = await friendsServices.getFriendRequests(
    userId,
    direction,
  );

  res.status(200).json({ status: "Success", data: friendshipRequests });
}

// Send request
export async function sendFriendRequest(req: Request, res: Response) {
  const result = idSchema.safeParse(req.body.requesteeId);
  if (!result.success) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const requesterId = req.user.id;
  const requesteeId = result.data;

  try {
    const request = await friendsServices.sendFriendRequest(
      requesterId,
      requesteeId,
    );
    res.status(201).json({
      status: "Success",
      message: "Friend request sent",
      data: request,
    });
  } catch (err) {
    if (err instanceof friendsServices.SelfFriendRequestError) {
      return res.status(400).json({
        status: "Error",
        error: "Cannot send a friend request to yourself",
      });
    }
    if (err instanceof friendsServices.UserNotFoundError) {
      return res.status(404).json({ status: "Error", error: "User not found" });
    }
    if (err instanceof friendsServices.AlreadyFriendsError) {
      return res
        .status(409)
        .json({ status: "Error", error: "Users already friends" });
    }
    if (err instanceof friendsServices.RequestPendingError) {
      return res
        .status(409)
        .json({ status: "Error", error: "Friend request already pending" });
    }
    throw err;
  }
}

export async function acceptFriendship(req: Request, res: Response) {
  const result = idSchema.safeParse(req.body.requesterId);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }

  const requesterId = result.data;
  const requesteeId = req.user.id;

  const friendship = await friendsServices.getFriendship(
    requesterId,
    requesteeId,
  );

  if (!friendship) {
    return res
      .status(404)
      .json({ status: "Error", error: "Friend request not found" });
  }

  const updatedFriendship = await friendsServices.updateFriendship(friendship);

  res.status(200).json({ status: "Success", data: updatedFriendship });
}

export async function deleteFriendship(req: Request, res: Response) {
  const userId = req.user.id; // check type?
  const result = idSchema.safeParse(req.body.friendId);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }
  const friendId = result.data;

  const friend = await getUserById(friendId);
  if (!friend) {
    return res.status(404).json({ status: "Error", error: "User not found" });
  }

  // check if friendship exists
  const friendship = await friendsServices.getFriendship(userId, friendId);

  if (!friendship) {
    return res
      .status(404)
      .json({ status: "Error", error: " Friendship not found" });
  }

  friendsServices.deleteFriendship(friendship);

  res.status(200).json({ status: "Success", message: " Friendship deleted" });
}
