"use client";

import { useCallback, useEffect, useState } from "react";
import EventPreview, {
  NoNextEvent,
  NoUpcomingEvents,
  SmallEventPreview,
} from "@/features/dashboard/components/eventPreview";
import FriendPreview from "@/features/dashboard/components/friendPreview";
import NotificationList from "@/features/dashboard/components/notificationList";
import { getNotifications } from "@/features/dashboard/lib/api";
import { getUpcomingEvents } from "@/features/event/lib/api";
import { getMyFriends } from "@/shared/lib/api";
import LoadError from "@/shared/components/loadError";
import Button from "@/shared/components/button";

import type { Notification } from "@flock/shared/schemas/notifications";

const MAX_UPCOMING_EVENTS = 6;
const NOTIFICATION_REFRESH_MS = 60_000;

type Loadable<T> = T | null | undefined;

function useLoad<T>(load: () => Promise<T>) {
  const [value, setValue] = useState<Loadable<T>>(undefined);

  useEffect(() => {
    let ignore = false;
    load()
      .then((result) => {
        if (!ignore) setValue(result);
      })
      .catch((err) => {
        console.error(err);
        if (!ignore) setValue(null);
      });
    return () => {
      ignore = true;
    };
  }, [load]);

  const reload = useCallback(() => {
    load()
      .then(setValue)
      .catch((err) => console.error(err));
  }, [load]);

  return [value, setValue, reload] as const;
}

export default function PrivateHomePage() {
  const [events] = useLoad(getUpcomingEvents);
  const [notifications, setNotifications, reloadNotifications] =
    useLoad(getNotifications);
  const [friends, setFriends, reloadFriends] = useLoad(getMyFriends);
  const [showAllEvents, setShowAllEvents] = useState(false);

  useEffect(() => {
    function refresh() {
      if (document.visibilityState !== "visible") return;
      reloadNotifications();
      reloadFriends();
    }

    const interval = setInterval(refresh, NOTIFICATION_REFRESH_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [reloadNotifications, reloadFriends]);

  function handleFriendRequest(notification: Notification, accepted: boolean) {
    setNotifications((prev) =>
      prev?.filter(({ id }) => id !== notification.id),
    );
    if (accepted) {
      setFriends((prev) => prev && [notification.from, ...prev]);
    }
  }

  const [nextEvent, ...upcomingEvents] = events ?? [];
  const shownEvents = showAllEvents
    ? upcomingEvents
    : upcomingEvents.slice(0, MAX_UPCOMING_EVENTS);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-4 lg:flex-row lg:items-start lg:gap-16">
      <div className="flex w-full flex-col gap-4 lg:sticky lg:top-24 lg:order-last lg:gap-12">
        <FriendPreview friends={friends} />
        <NotificationList
          notifications={notifications}
          onFriendRequestHandled={handleFriendRequest}
        />
      </div>
      <div className="flex w-full min-w-0 flex-col gap-4">
        <h2 className="flock-h2">Your next event</h2>
        {events === undefined ? (
          <p className="flock-body text-(--color-text-muted)">Loading…</p>
        ) : events === null ? (
          <LoadError>
            {"Couldn't load your events. Try refreshing the page."}
          </LoadError>
        ) : (
          <>
            {nextEvent ? (
              <EventPreview event={nextEvent.event} status={nextEvent.status} />
            ) : (
              <NoNextEvent />
            )}
            <h3 className="flock-h3">Upcoming</h3>
            <div className="flex flex-wrap justify-between gap-2">
              {upcomingEvents.length > 0 ? (
                shownEvents.map(({ event, status }) => (
                  <SmallEventPreview
                    key={event.id}
                    event={event}
                    status={status}
                  />
                ))
              ) : (
                <NoUpcomingEvents />
              )}
            </div>
            {upcomingEvents.length > MAX_UPCOMING_EVENTS && (
              <Button
                variant="tertiary"
                className="self-center"
                onClick={() => setShowAllEvents((shown) => !shown)}
              >
                {showAllEvents
                  ? "Show less"
                  : `See all (${upcomingEvents.length})`}
              </Button>
            )}
          </>
        )}
      </div>
    </main>
  );
}
