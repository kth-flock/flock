import {
  exampleFriends,
  exampleNotifications,
} from "@/features/event/lib/exampleData";
import type { PublicUser } from "@/shared/types/user";
import type { DashboardNotification } from "./types";

// TODO: fetch from the backend once it has a notifications endpoint
export async function getNotifications(): Promise<DashboardNotification[]> {
  return exampleNotifications.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// TODO: fetch from the backend (friendships)
export async function getFriends(): Promise<PublicUser[]> {
  return exampleFriends;
}
