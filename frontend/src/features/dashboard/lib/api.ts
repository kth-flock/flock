import type { Notification } from "@flock/shared/schemas/notifications";
import { apiData } from "@/shared/lib/https";
import type { Serialized } from "@/shared/types/serialized";

export const getNotifications = async (): Promise<Notification[]> =>
  (
    await apiData<Serialized<Notification[]>>("/me/notifications", {
      fallbackError: "Failed to get notifications",
    })
  ).map((notification) => ({
    ...notification,
    from: {
      ...notification.from,
      createdAt: new Date(notification.from.createdAt),
    },
    createdAt: new Date(notification.createdAt),
  }));
