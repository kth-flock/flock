import type { PublicUser, PrivateUser } from "../types/user";

export function fullName(user: PublicUser | PrivateUser | undefined) {
  return `${user?.firstName} ${user?.lastName}`;
}
