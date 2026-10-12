"use client";
import { useEffect, useState } from "react";
import EventPreview, {
  NoNextEvent,
  NoUpcomingEvents,
  SmallEventPreview,
} from "@/features/dashboard/components/eventPreview";
import FriendPreview from "@/features/dashboard/components/friendPreview";
import NotificationList from "@/features/dashboard/components/notificationList";
import { getNotifications } from "@/features/dashboard/lib/api";
import { getUpcomingEvents } from "@/features/event/lib/api";
import { getMyFriends } from "@/shared/lib/friends";

import type { DashboardNotification } from "@/features/dashboard/lib/types";
import type { EventDetails } from "@/features/event/lib/types";
import type { PublicUser } from "@/shared/types/user";

type DashboardData = {
  events: EventDetails[];
  notifications: DashboardNotification[];
  friends: PublicUser[];
};

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    let ignore = false;

    Promise.all([getUpcomingEvents(), getNotifications(), getMyFriends()]).then(
      ([events, notifications, friends]) => {
        if (!ignore) setData({ events, notifications, friends });
      },
    );

    return () => {
      ignore = true;
    };
  }, []);

  // TODO: Replace with proper loading page
  if (!data) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="flock-body text-(--color-text-muted)">Loading…</p>
      </main>
    );
  }

  const { notifications, friends } = data;
  const [nextEvent, ...upcomingEvents] = data.events;

  return (
    <main className="flex flex-col md:flex-row gap-4 md:gap-16 flex-1 items-center md:items-start justify-center mx-auto w-full max-w-5xl">
      <div className="md:sticky md:top-24 w-full flex flex-col gap-4 md:gap-12 md:order-last">
        <FriendPreview friends={friends} />
        <NotificationList notifications={notifications} />
      </div>
      <div className="w-full min-w-0 flex flex-col gap-4">
        <h2 className="flock-h2">Your next event</h2>
        {nextEvent ? <EventPreview event={nextEvent} /> : <NoNextEvent />}
        <h3 className="flock-h3">Upcoming</h3>
        <div className="flex flex-wrap gap-2 justify-between">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <SmallEventPreview key={event.id} event={event} />
            ))
          ) : (
            <NoUpcomingEvents />
          )}
        </div>
      </div>
    </main>
  );
}
