import {
  ChangeEmail,
  ChangePassword,
  UserId,
  UserInfo,
} from "@flock/shared/schemas/user";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import { privateUserInformationSelect } from "../utils/selectors";
import { ConflictError, ForbiddenError, NotFoundError } from "../utils/errors";

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

async function checkPassword(userId: UserId, password: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { pwdHash: true },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (!user.pwdHash || !(await bcrypt.compare(password, user.pwdHash))) {
    throw new ForbiddenError("Current password is incorrect");
  }
}

export async function changeEmail(userId: UserId, data: ChangeEmail) {
  await checkPassword(userId, data.password);

  const emailOwner = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });
  if (emailOwner && emailOwner.id !== userId) {
    throw new ConflictError("Email is already in use");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    select: privateUserInformationSelect,
    data: { email: data.email },
  });

  return updatedUser;
}

export async function changePassword(userId: UserId, data: ChangePassword) {
  await checkPassword(userId, data.currentPassword);

  const pwdHash = await bcrypt.hash(data.newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { pwdHash },
  });
}
