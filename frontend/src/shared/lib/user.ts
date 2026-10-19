import type { PrivateUser, PublicUser } from "../types/user";

export function fullName(user: PublicUser | PrivateUser | undefined) {
  return `${user?.firstName} ${user?.lastName}`;
}

export function withCreatedAt<T extends { createdAt: string | Date }>(
  user: T,
): Omit<T, "createdAt"> & { createdAt: Date } {
  const createdAt = new Date(user.createdAt);
  if (Number.isNaN(createdAt.getTime())) {
    throw new TypeError("Invalid user createdAt timestamp");
  }

  return { ...user, createdAt };
}
