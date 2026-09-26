import { idSchema } from "../../../shared/schemas/common";
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
