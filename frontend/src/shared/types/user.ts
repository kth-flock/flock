import type { FriendshipStatus } from "@flock/shared/schemas/user";

export type PublicUser = {
  id: number;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  createdAt?: Date;
};

export type PrivateUser = PublicUser & {
  email: string;
};

export type UserSearchResult = PublicUser & {
  friendshipStatus: FriendshipStatus;
};
