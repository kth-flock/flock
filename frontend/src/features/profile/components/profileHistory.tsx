import { SmallEventPreview } from "@/features/dashboard/eventPreview";
import type { EventSummary, InvitedEvent } from "@/features/event/lib/types";

type ProfileHistoryProps = {
  hostedEvents: EventSummary[];
  invitedEvents: InvitedEvent[];
};

export default function ProfileHistory({
  hostedEvents,
  invitedEvents,
}: ProfileHistoryProps) {
  const history = [...hostedEvents, ...invitedEvents].toSorted((a, b) =>
    b.startsAt.localeCompare(a.startsAt),
  );

  return (
    <section className="flex flex-col gap-4">
      <h2 className="flock-h2 text-primary">My history</h2>

      {history.length === 0 && (
        <p className="rounded-2xl border-2 border-dashed border-accent p-6 text-center flock-body-sm text-(--color-text-muted)">
          Nothing here yet.
        </p>
      )}

      {history.map((event) => (
        <SmallEventPreview key={event.id} event={event} />
      ))}
    </section>
  );
}
