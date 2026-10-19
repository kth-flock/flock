import {
  SmallEventPreview,
  type EventStatus,
} from "@/features/dashboard/components/eventPreview";
import type { EventSummary, InvitedEvent } from "@/features/event/lib/types";
import ProfileHistorySkeleton from "./profileHistorySkeleton";

type ProfileHistoryProps = {
  hostedEvents: EventSummary[] | null;
  invitedEvents: InvitedEvent[] | null;
  isLoading: boolean;
};

export default function ProfileHistory({
  hostedEvents,
  invitedEvents,
  isLoading,
}: ProfileHistoryProps) {
  const byId = new Map<number, { event: EventSummary; status: EventStatus }>();
  for (const event of invitedEvents ?? []) {
    byId.set(event.id, {
      event,
      status: event.invitees[0]?.rsvp ?? "PENDING",
    });
  }
  for (const event of hostedEvents ?? []) {
    byId.set(event.id, { event, status: "HOST" });
  }

  const history = [...byId.values()].toSorted(
    (a, b) => b.event.startsAt.getTime() - a.event.startsAt.getTime(),
  );

  return (
    <section className="flex flex-col gap-4">
      <h2 className="flock-h2 text-primary">My history</h2>

      {isLoading && <ProfileHistorySkeleton />}

      {!isLoading && history.length === 0 && hostedEvents && invitedEvents && (
        <p className="rounded-2xl border-2 border-dashed border-accent p-6 text-center flock-body-sm text-text-muted">
          Nothing here yet.
        </p>
      )}

      {!isLoading &&
        history.map(({ event, status }) => (
          <SmallEventPreview key={event.id} event={event} status={status} />
        ))}
    </section>
  );
}
