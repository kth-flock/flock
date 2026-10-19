import type { InvitedEvent } from "@/features/event/lib/types";
import LoadError from "@/shared/components/loadError";
import Skeleton from "@/shared/components/skeleton";
import EventHistory, { type HistoryItem } from "./eventHistory";

export default function EventsTogether({
  events,
  error,
  onRetry,
  myId,
  isLoading,
}: {
  events: InvitedEvent[] | null;
  error?: string | null;
  onRetry?: () => void;
  myId: number;
  isLoading: boolean;
}) {
    const items: HistoryItem[] = (events ?? []).map((event) => {
    const isMine = event.createdById === myId;
    return {
      event,
      status: isMine ? "HOST" : (event.invitees[0]?.rsvp ?? "PENDING"),
      statusLabel: isMine ? "Hosted by you" : undefined,
    };
  });

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
      ) :  (
        <EventHistory
      title="Events together"
      sectionTitles={{
        upcoming: "Upcoming events together",
        past: "Past events together",
      }}
      items={items}
      isLoading={isLoading}
      hasError={!isLoading && !events}
      emptyText="No events together yet."
      errorText="Couldn't load your events together. Try refreshing the page."
      hiddenFilters={["DECLINED"]}
    />
      )}
    </section>
  );
}
