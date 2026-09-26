import { Router } from "express";
import { prisma } from "../prisma";
import { STATUS } from "../../prisma/generated/enums";
import {
  getFriends,
  getUserById,
  publicUserInformationSelect,
} from "../utils/prismaUtils";
import { handleRouteError } from "../utils/errorHandlers";
import { idSchema } from "../../../shared/schemas/common";

export const friendshipsRouter = Router();

// GET ALL my friends
friendshipsRouter.get("/", async (req, res) => {
  try {
    const friendsInfo = await getFriends(idSchema.parse(req.user.id));

    res.status(200).json({ status: "Success", data: friendsInfo });
  } catch (error) {
    return handleRouteError(error, res);
  }
});

// GET friendship requests, use direction=sent or direction=received to get specific requests
friendshipsRouter.get("/requests", async (req, res) => {
  try {
    const status = STATUS.PENDING;
    const { direction } = req.query;
    const userId = req.user.id;

    const where =
      direction === "received"
        ? { status, requesteeId: userId }
        : direction === "sent"
          ? { status, requesterId: userId }
          : { status, OR: [{ requesterId: userId }, { requesteeId: userId }] };

    const friendships = await prisma.friendship.findMany({
      where,
      include: {
        requestee: { select: publicUserInformationSelect },
        requester: { select: publicUserInformationSelect },
      },
    });

    const friendshipRequests = friendships.map((f) =>
      f.requesterId === userId ? f.requestee : f.requester,
    );

    res.status(200).json({ status: "Success", data: friendshipRequests });
  } catch (error) {
    return handleRouteError(error, res);
  }
});

// Send requests
friendshipsRouter.post("/request", async (req, res) => {
  try {
    const requesterId = req.user.id;
    const requesteeId = idSchema.parse(req.body.requesteeId);

    if (requesteeId === requesterId) {
      return res.status(400).json({
        status: "Error",
        error: "Cannot send a friend request to yourself",
      });
    }

    const requestee = await getUserById(requesteeId);
    if (!requestee) {
      return res.status(404).json({ status: "Error", error: "User not found" });
    }

    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, requesteeId },
          { requesterId: requesteeId, requesteeId: requesterId },
        ],
      },
    });

    if (friendship?.status === "ACCEPTED") {
      return res
        .status(409)
        .json({ status: "Error", error: "Users already friends" });
    }
    if (friendship?.status === "PENDING") {
      return res
        .status(409)
        .json({ status: "Error", error: "Friend request already pending" });
    }

    const request = await prisma.friendship.create({
      data: { requesterId, requesteeId },
    });

    res.status(201).json({
      status: "Success",
      message: "Friend request sent",
      data: request,
    });
  } catch (error) {
    return handleRouteError(error, res);
  }
});

// accept request
friendshipsRouter.patch("/request", async (req, res) => {
  try {
    const requesteeId = req.user.id;
    const requesterId = idSchema.parse(req.body.requesterId);

    const friendship = await prisma.friendship.update({
      where: {
        requesterId_requesteeId: { requesterId, requesteeId },
        status: STATUS.PENDING,
      },
      data: { status: STATUS.ACCEPTED },
    });

    res.status(200).json({ status: "Success", data: friendship });
  } catch (error) {
    return handleRouteError(error, res);
  }
});

// delete friendship
friendshipsRouter.delete("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = idSchema.parse(req.body.friendId);
    const friend = await getUserById(friendId);
    if (!friend) {
      return res.status(404).json({ status: "Error", error: "User not found" });
    }

    // check if friendship exists
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: friendId, requesteeId: userId },
          { requesterId: userId, requesteeId: friendId },
        ],
        status: { in: [STATUS.ACCEPTED, STATUS.PENDING] },
      },
    });

    if (!friendship) {
      return res
        .status(404)
        .json({ status: "Error", error: " Friendship not found" });
    }

    await prisma.friendship.delete({
      where: {
        requesterId_requesteeId: {
          requesterId: friendship.requesterId,
          requesteeId: friendship.requesteeId,
        },
      },
    });
    res.status(200).json({ status: "Success", message: " Friendship deleted" });
  } catch (error) {
    return handleRouteError(error, res);
  }
});
function getAcceptedFriends(arg0: number) {
  throw new Error("Function not implemented.");
}
