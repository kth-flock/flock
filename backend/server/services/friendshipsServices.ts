import { Direction } from "@flock/shared/schemas/common";
import { UserId } from "@flock/shared/schemas/user";
import { Friendship } from "../../prisma/generated/client";
import { STATUS } from "../../prisma/generated/enums";
import { prisma } from "../prisma";
import { publicUserInformationSelect } from "../utils/selectors";
import { getUserById } from "./usersServices";
import { ConflictError, NotFoundError, ValidationError } from "../utils/errors";

export async function getAllFriends(userId: UserId) {
  const friendships = await prisma.friendship.findMany({
    where: {
      status: STATUS.ACCEPTED,
      OR: [{ requesterId: userId }, { requesteeId: userId }],
    },
    include: {
      requester: { select: publicUserInformationSelect },
      requestee: { select: publicUserInformationSelect },
    },
  });

  const friendInfo = friendships.map((f) =>
    f.requesterId === userId ? f.requestee : f.requester,
  );

  return friendInfo;
}

export async function getFriendRequests(userId: UserId, direction: Direction) {
  const status = STATUS.PENDING;
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

  return friendshipRequests;
}

export async function sendFriendRequest(
  requesterId: UserId,
  requesteeId: UserId,
) {
  if (requesteeId === requesterId) {
    throw new ValidationError("Cannot send a friend request to yourself");
  }

  const requestee = await getUserById(requesteeId);
  if (!requestee) {
    throw new NotFoundError("User not found");
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
    throw new ConflictError("Users already friends");
  }
  if (friendship?.status === "PENDING") {
    throw new ConflictError("Friend request already pending");
  }

  return prisma.friendship.create({
    data: { requesterId, requesteeId },
  });
}

export async function getFriendship(userId: UserId, friendId: UserId) {
  const friendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId: friendId, requesteeId: userId },
        { requesterId: userId, requesteeId: friendId },
      ],
      status: { in: [STATUS.ACCEPTED, STATUS.PENDING] },
    },
  });
  return friendship;
}

export async function updateFriendship(friendship: Friendship) {
  const updatedFriendship = await prisma.friendship.update({
    where: {
      requesterId_requesteeId: {
        requesterId: friendship.requesterId,
        requesteeId: friendship.requesteeId,
      },
    },
    data: { status: STATUS.ACCEPTED, updatedAt: new Date() },
  });
  return updatedFriendship;
}

export async function deleteFriendship(friendship: Friendship) {
  await prisma.friendship.delete({
    where: {
      requesterId_requesteeId: {
        requesterId: friendship.requesterId,
        requesteeId: friendship.requesteeId,
      },
    },
  });
}
