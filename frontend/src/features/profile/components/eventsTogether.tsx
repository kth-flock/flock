import type { InvitedEvent } from "@/features/event/lib/types";
import Skeleton from "@/shared/components/skeleton";
import EventHistory, { type HistoryItem } from "./eventHistory";

export default function EventsTogether({
  events,
  error,
  onRetry,
  myId,
  isLoading = events === null && !error,
}: {
  // null while loading or if loading failed
  events: InvitedEvent[] | null;
  error?: string | null;
  onRetry?: () => void;
  myId: number;
  isLoading?: boolean;
}) {
  const items: HistoryItem[] = (events ?? []).map((event) => {
    const isMine = event.createdById === myId;
    return {
      event,
      status: isMine ? "HOST" : (event.invitees[0]?.rsvp ?? "PENDING"),
      // "Hosting" is unclear on someone else's profile
      statusLabel: isMine ? "Hosted by you" : undefined,
    };
  });

  return (
    <EventHistory
      title="Events together"
      sectionTitles={{
        upcoming: "Upcoming events together",
        past: "Past events together",
      }}
      items={items}
      isLoading={isLoading}
      loadingFallback={
        <div className="flex flex-col gap-4">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      }
      error={
        error ??
        (!isLoading && !events ? "Couldn't load your events together." : null)
      }
      onRetry={onRetry}
      emptyText="No events together yet."
      // Events either of you declined aren't counted as together
      hiddenFilters={["DECLINED"]}
    />
  );
}
