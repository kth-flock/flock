import type { FriendshipStatus } from "@flock/shared/schemas/user";

export type PublicUser = {
  id: number;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  createdAt?: Date;
};

export type ProfileUser = PublicUser & {
  createdAt: Date;
};

export type PrivateUser = ProfileUser & {
  email: string;
};

export type SerializedUser<T extends { createdAt: Date }> = Omit<
  T,
  "createdAt"
> & {
  createdAt: string;
};

export type UserSearchResult = PublicUser & {
  friendshipStatus: FriendshipStatus;
};
