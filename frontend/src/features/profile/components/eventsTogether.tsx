import { SmallEventPreview } from "@/features/dashboard/components/eventPreview";
import type { InvitedEvent } from "@/features/event/lib/types";
import LoadError from "@/shared/components/loadError";
import Skeleton from "@/shared/components/skeleton";

export default function EventsTogether({
  events,
  error,
  onRetry,
  myId,
}: {
  events: InvitedEvent[] | null;
  error?: string | null;
  onRetry?: () => void;
  myId: number;
}) {
  const isLoading = events === null && !error;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="flock-h2 text-primary">Upcoming events together</h2>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      ) : error || !events ? (
        <LoadError onRetry={onRetry}>
          {error ?? "Couldn't load your events together."}
        </LoadError>
      ) : events.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-accent p-6 text-center flock-body-sm text-text-muted">
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
