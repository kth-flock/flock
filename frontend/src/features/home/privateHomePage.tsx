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
import {
  getUpcomingEvents,
  type UpcomingEvent,
} from "@/features/event/lib/api";
import { getMyFriends } from "@/shared/lib/api";

import type { DashboardNotification } from "@/features/dashboard/lib/types";
import type { PublicUser } from "@/shared/types/user";

type DashboardData = {
  events: UpcomingEvent[];
  notifications: DashboardNotification[];
  friends: PublicUser[];
};

export default function PrivateHomePage() {
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
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-4 md:flex-row md:items-start md:gap-16">
      <div className="flex w-full flex-col gap-4 md:sticky md:top-24 md:order-last md:gap-12">
        <FriendPreview friends={friends} />
        <NotificationList notifications={notifications} />
      </div>
      <div className="flex w-full min-w-0 flex-col gap-4">
        <h2 className="flock-h2">Your next event</h2>
        {nextEvent ? (
          <EventPreview event={nextEvent.event} status={nextEvent.status} />
        ) : (
          <NoNextEvent />
        )}
        <h3 className="flock-h3">Upcoming</h3>
        <div className="flex flex-wrap justify-between gap-2">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(({ event, status }) => (
              <SmallEventPreview key={event.id} event={event} status={status} />
            ))
          ) : (
            <NoUpcomingEvents />
          )}
        </div>
      </div>
    </main>
  );
}
