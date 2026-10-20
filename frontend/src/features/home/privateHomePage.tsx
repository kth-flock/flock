"use client";

import FriendPreview from "@/features/dashboard/components/friendPreview";
import NotificationList from "@/features/dashboard/components/notificationList";
import UpcomingEvents from "@/features/dashboard/components/upcomingEvents";
import { getNotifications } from "@/features/dashboard/lib/api";
import { getUpcomingEvents } from "@/features/event/lib/api";
import { getMyFriends } from "@/shared/lib/api";
import { useFetch } from "@/shared/hooks/useFetch";
import { useRefreshWhenVisible } from "@/shared/hooks/useRefreshWhenVisible";
import type { Notification } from "@flock/shared/schemas/notifications";

const REFRESH_MS = 60_000;

export default function PrivateHomePage() {
  const events = useFetch(getUpcomingEvents);
  const notifications = useFetch(getNotifications);
  const friends = useFetch(getMyFriends);

  useRefreshWhenVisible(() => {
    notifications.refetch();
    friends.refetch();
  }, REFRESH_MS);

  function handleFriendRequest(notification: Notification, accepted: boolean) {
    notifications.setData(
      (prev) => prev?.filter(({ id }) => id !== notification.id) ?? null,
    );
    if (accepted)
      friends.setData((prev) => prev && [notification.from, ...prev]);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-4 lg:flex-row lg:items-start lg:gap-16">
      <div className="flex w-full flex-col gap-4 lg:sticky lg:top-24 lg:order-last lg:gap-12">
        <FriendPreview
          friends={friends.isLoading ? undefined : friends.data}
          error={friends.error}
          onRetry={friends.refetch}
        />
        <NotificationList
          notifications={
            notifications.isLoading ? undefined : notifications.data
          }
          error={notifications.error}
          onRetry={notifications.refetch}
          onFriendRequestHandled={handleFriendRequest}
        />
      </div>
      <div className="flex w-full min-w-0 flex-col gap-4">
        <h2 className="flock-h2">Your next event</h2>
        <UpcomingEvents
          events={events.isLoading ? undefined : events.data}
          error={events.error}
          onRetry={events.refetch}
        />
      </div>
    </div>
  );
}
