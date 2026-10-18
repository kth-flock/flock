// features/dashboard/components/upcomingEvents.tsx
"use client";

import { useState } from "react";
import Button from "@/shared/components/button";
import LoadError from "@/shared/components/loadError";
import EventPreview, {
  NoNextEvent,
  NoUpcomingEvents,
  SmallEventPreview,
} from "./eventPreview";
import type { UpcomingEvent } from "@/features/event/lib/api";

const MAX_UPCOMING_EVENTS = 6;

export default function UpcomingEvents({
  events,
}: {
  events: UpcomingEvent[] | null | undefined;
}) {
  const [showAll, setShowAll] = useState(false);

  if (events === undefined)
    return <p className="flock-body text-(--color-text-muted)">Loading…</p>;
  if (events === null)
    return (
      <LoadError>
        {"Couldn't load your events. Try refreshing the page."}
      </LoadError>
    );

  const [next, ...upcoming] = events;
  const shown = showAll ? upcoming : upcoming.slice(0, MAX_UPCOMING_EVENTS);

  return (
    <>
      {next ? (
        <EventPreview event={next.event} status={next.status} />
      ) : (
        <NoNextEvent />
      )}
      <h3 className="flock-h3">Upcoming</h3>
      <div className="flex flex-wrap justify-between gap-2">
        {upcoming.length > 0 ? (
          shown.map(({ event, status }) => (
            <SmallEventPreview key={event.id} event={event} status={status} />
          ))
        ) : (
          <NoUpcomingEvents />
        )}
      </div>
      {upcoming.length > MAX_UPCOMING_EVENTS && (
        <Button
          variant="tertiary"
          className="self-center"
          onClick={() => setShowAll((s) => !s)}
        >
          {showAll ? "Show less" : `See all (${upcoming.length})`}
        </Button>
      )}
    </>
  );
}
