import {
  ChangeEmail,
  ChangePassword,
  UserId,
  UserInfo,
} from "@flock/shared/schemas/user";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import { privateUserInformationSelect } from "../utils/selectors";
import { deleteImageFromS3 } from "./imageService";
import { ConflictError, ForbiddenError, NotFoundError } from "../utils/errors";

export async function getMyAccount(userId: UserId) {
  const account = await prisma.user.findUnique({
    where: { id: userId },
    select: privateUserInformationSelect,
  });

  if (!account) throw new NotFoundError("User not found");

  return account;
}

export async function deleteMyAccount(userId: UserId, imageUrl: string | null) {
  // TODO add assert user
  // TODO add check if you're allowed to delete this user

  await prisma.user.delete({
    where: { id: userId },
  });

  if (imageUrl) {
    await deleteImageFromS3(imageUrl).catch((error) =>
      console.error("Failed to delete event image from S3:", error),
    );
  }
}

export async function editUserInfo(
  userId: UserId,
  data: UserInfo,
  prevImageUrl: string | null,
) {
  // TODO add assert user
  // TODO add check if you're allowed to edit this user

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    select: privateUserInformationSelect,
    data,
  });

  if (
    prevImageUrl &&
    data.imageUrl !== undefined &&
    prevImageUrl !== data.imageUrl
  ) {
    deleteImageFromS3(prevImageUrl).catch((error) =>
      console.error(`Failed to delete old image ${prevImageUrl}`, error),
    );
  }

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
  // TODO add user check ?
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
  // TODO add user check (?)
  await checkPassword(userId, data.currentPassword);

  const pwdHash = await bcrypt.hash(data.newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { pwdHash },
  });
}
