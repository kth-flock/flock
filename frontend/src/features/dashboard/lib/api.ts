import { exampleNotifications } from "@/features/event/lib/exampleData";
import type { DashboardNotification } from "./types";

// TODO: fetch from the backend once it has a notifications endpoint
export async function getNotifications(): Promise<DashboardNotification[]> {
  return exampleNotifications.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));
}
