import { SmallEventPreview } from "@/features/dashboard/components/eventPreview";
import type { InvitedEvent } from "@/features/event/lib/types";
import LoadError from "./loadError";

export default function EventsTogether({
  events,
  myId,
}: {
  events: InvitedEvent[] | null;
  myId: number;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="flock-h2 text-primary">Upcoming events together</h2>

      {!events ? (
        <LoadError>
          {"Couldn't load your events together. Try refreshing the page."}
        </LoadError>
      ) : events.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-accent p-6 text-center flock-body-sm text-(--color-text-muted)">
          No upcoming events together yet.
        </p>
      ) : (
        events.map((event) => (
          <SmallEventPreview
            key={event.id}
            event={event}
            status={
              event.createdById === myId
                ? "HOST"
                : (event.invitees[0]?.rsvp ?? "PENDING")
            }
          />
        ))
      )}
    </section>
  );
}
