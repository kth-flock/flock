import {
  SmallEventPreview,
  type EventStatus,
} from "@/features/dashboard/components/eventPreview";
import type { EventSummary, InvitedEvent } from "@/features/event/lib/types";

type ProfileHistoryProps = {
  hostedEvents: EventSummary[];
  invitedEvents: InvitedEvent[];
};

export default function ProfileHistory({
  hostedEvents,
  invitedEvents,
}: ProfileHistoryProps) {
  const history = [
    ...hostedEvents.map((event) => ({ event, status: "HOST" as EventStatus })),
    ...invitedEvents.map((event) => ({
      event,
      status: event.invitees[0]?.rsvp ?? "PENDING",
    })),
  ].toSorted((a, b) => b.event.startsAt.getTime() - a.event.startsAt.getTime());

  return (
    <section className="flex flex-col gap-4">
      <h2 className="flock-h2 text-primary">My history</h2>

      {history.length === 0 && (
        <p className="rounded-2xl border-2 border-dashed border-accent p-6 text-center flock-body-sm text-(--color-text-muted)">
          Nothing here yet.
        </p>
      )}

      {history.map(({ event, status }) => (
        <SmallEventPreview key={event.id} event={event} status={status} />
      ))}
    </section>
  );
}
