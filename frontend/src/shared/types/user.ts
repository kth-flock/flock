import type { FriendshipStatus } from "@flock/shared/schemas/user";

// Public user info the backend includes on events, announcements and comments
export type PublicUser = {
  id: number;
  firstName: string;
  lastName: string;
  imageUrl?: string | null;
};

export type UserSearchResult = PublicUser & {
  friendshipStatus: FriendshipStatus;
};
