import { prisma } from "../prisma";
import { publicUserInformationSelect } from "../utils/selectors";
import { FriendshipStatus, UserId } from "@flock/shared/schemas/user";

export async function getUsers() {
  const users = await prisma.user.findMany({
    select: publicUserInformationSelect,
  });

  return users;
}

export async function getUserById(id: UserId) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: publicUserInformationSelect,
  });
  return user;
}

export async function searchUsers(myId: UserId, query = "") {
  const searchTerms = query.split(/\s+/).filter(Boolean);

  const users = await prisma.user.findMany({
    where: {
      id: { not: myId },
      AND: searchTerms.map((term) => ({
        OR: [
          { firstName: { contains: term, mode: "insensitive" } },
          { lastName: { contains: term, mode: "insensitive" } },
        ],
      })),
    },
    select: publicUserInformationSelect,
    orderBy: { firstName: "asc" },
    take: 15,
  });

  const ids = users.map((u) => u.id);
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [
        { requesterId: myId, requesteeId: { in: ids } },
        { requesterId: { in: ids }, requesteeId: myId },
      ],
    },
  });

  const statusById = new Map<number, FriendshipStatus>();

  for (const friend of friendships) {
    const iAmRequester = friend.requesterId === myId;
    const otherUsersId = iAmRequester ? friend.requesteeId : friend.requesterId;
    statusById.set(
      otherUsersId,
      friend.status === "ACCEPTED"
        ? "FRIENDS"
        : iAmRequester
          ? "REQUEST_SENT"
          : "REQUEST_RECEIVED",
    );
  }

  return users.map((user) => ({
    ...user,
    friendshipStatus: statusById.get(user.id) ?? "NONE",
  }));
}
