import { idSchema } from "@flock/shared/schemas/common";
import { prisma } from "../prisma";
import { publicUserInformationSelect } from "../utils/selectors";
import { z } from "zod";
import { UserId } from "@flock/shared/schemas/user";

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
