import { exampleFriends } from "@/features/event/lib/exampleData";
import type { PublicUser } from "@/shared/types/user";

// TODO: fetch from backend. Returns logged in user's friends.
export async function getMyFriends(): Promise<PublicUser[]> {
  return exampleFriends;
}
