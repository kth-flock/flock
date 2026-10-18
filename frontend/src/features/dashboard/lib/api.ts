import type { Notification } from "@flock/shared/schemas/notifications";
import { apiData } from "@/shared/lib/https";
import type { Serialized } from "@/shared/types/serialized";

export const getNotifications = async (): Promise<Notification[]> =>
  (
    await apiData<SerializedNotification[]>("/me/notifications", {
      fallbackError: "Failed to get notifications",
    })
  ).map((notification) => ({
    ...notification,
    createdAt: new Date(notification.createdAt),
  }));
