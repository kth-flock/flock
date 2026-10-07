import { exampleProfiles } from "@/features/event/lib/exampleData";
import type { ProfileDetails } from "./types";

// TODO: fetch from the backend (GET /users/:userId), see shared/lib/apiFetch.ts.
// Until then this only knows the example profiles. Returns null when the
// profile doesn't exist.
export async function getProfile(
  profileId: string,
): Promise<ProfileDetails | null> {
  return (
    exampleProfiles.find((profile) => profile.id === Number(profileId)) ?? null
  );
}

// TODO: fetch from the backend (GET /me), forwarding the token cookie. Until
// then the first example profile is the logged in user. Returns null when not
// logged in.
export async function getMyProfile(): Promise<ProfileDetails | null> {
  return exampleProfiles[0];
}
