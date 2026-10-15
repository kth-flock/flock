import type { ProfileUser } from "@/shared/types/user";

// Shape returned by GET /users/:userId
export type ProfileDetails = ProfileUser;

// Shape returned by GET /me, your own profile including your email
export type MyProfileDetails = ProfileDetails & { email: string };
