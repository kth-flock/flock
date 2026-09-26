import { idSchema } from "../../../shared/schemas/common";
import { STATUS } from "../../prisma/generated/enums";
import { prisma } from "../prisma";
import { z } from "zod";

type UserId = z.infer<typeof idSchema>;

export const publicUserInformationSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  imageUrl: true,
} as const;

export const privateUserInformationSelect = {
  ...publicUserInformationSelect,
  createdAt: true,
};

export async function getUserById(id: UserId) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: publicUserInformationSelect,
  });
  return user;
}

export async function getFriends(userId: number) {
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
