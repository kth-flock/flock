"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/shared/components/button";
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

export function PublicHomePage() {
  return (
    <>
      <div
        className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#8bc596_0%,#ffffff_80%)]"
        aria-hidden
      />
      <div className="flex flex-col items-center justify-center gap-5 text-center">
        <Image
          src="/logo.svg"
          alt="Flock"
          width={100}
          height={100}
          loading="eager"
          className="h-32 w-32 md:h-48 md:w-48"
        />
        <h1 className="flock-h1">Welcome to Flock</h1>
        <h2 className="flock-h3">The independant event creator</h2>
        <ul className="text-left">
          <li className="flock-body">• Create cool events</li>
          <li className="flock-body">• Invite all your friends</li>
          <li className="flock-body">• party party party</li>
        </ul>
        <div className="mt-6 flex w-full items-center justify-center gap-4">
          <Button
            className="w-full justify-center"
            variant="primary"
            size="lg"
            href="/register"
          >
            Sign Up
          </Button>
          <Button
            className="w-full justify-center"
            variant="secondary"
            size="lg"
            href="/login"
          >
            Log In
          </Button>
        </div>
      </div>
    </>
  );
}

export function PrivateHomePage() {
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
        {nextEvent ? <EventPreview event={nextEvent} /> : <NoNextEvent />}
        <h3 className="flock-h3">Upcoming</h3>
        <div className="flex flex-wrap justify-between gap-2">
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
