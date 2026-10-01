import { UserId, UserInfo } from "@flock/shared/schemas/user";
import { prisma } from "../prisma";
import { privateUserInformationSelect } from "../utils/selectors";

export async function getMyAccount(userId: UserId) {
  const account = await prisma.user.findUnique({
    where: { id: userId },
    select: privateUserInformationSelect,
  });

  return account;
}

export async function deleteMyAccount(userId: UserId) {
  await prisma.user.delete({
    where: { id: userId },
  });
}

export async function editUserInfo(userId: UserId, data: UserInfo) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    select: privateUserInformationSelect,
    data,
  });

  return updatedUser;
}
