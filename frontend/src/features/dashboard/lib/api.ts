import type { Notification } from "@flock/shared/schemas/notifications";
import { apiData } from "@/shared/lib/https";
import type { Serialized } from "@/shared/types/serialized";

export const getNotifications = async (): Promise<Notification[]> =>
  (
    await apiData<Serialized<Notification[]>>("/me/notifications", {
      fallbackError: "Failed to get notifications",
    })
  ).map((notification) => {
    const { createdAt: fromCreatedAt, ...from } = notification.from;
    return {
      ...notification,
      from: {
        ...from,
        ...(fromCreatedAt === undefined
          ? {}
          : { createdAt: new Date(fromCreatedAt) }),
      },
      createdAt: new Date(notification.createdAt),
    };
  });
