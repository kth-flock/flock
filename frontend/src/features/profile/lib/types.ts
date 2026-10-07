import type { PublicUser } from "@/shared/types/user";

// Shape returned by GET /users/:userId, extend as the profile page grows

export type ProfileDetails = PublicUser;
