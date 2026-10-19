import type { Notification } from "@flock/shared/schemas/notifications";
import { API_BASE_URL } from "@/shared/lib/api";

export async function getNotifications(): Promise<Notification[]> {
  const res = await fetch(`${API_BASE_URL}/me/notifications`, {
    credentials: "include",
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to get notifications");
  }

  const response: { data: Notification[] } = await res.json();
  return response.data.map((notification) => ({
    ...notification,
    createdAt: new Date(notification.createdAt),
  }));
}
