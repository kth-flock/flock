import type { EventSummary, InvitedEvent } from "@/features/event/lib/types";
import EventHistory, { type HistoryItem } from "./eventHistory";
import { ProfileHistorySkeleton } from "./profilePageSkeleton";

type ProfileHistoryProps = {
  hostedEvents: EventSummary[] | null;
  invitedEvents: InvitedEvent[] | null;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export default function ProfileHistory({
  hostedEvents,
  invitedEvents,
  isLoading,
  error,
  onRetry,
}: ProfileHistoryProps) {
  // An event you host can also come back as an invite. Keep it once, as hosting
  const byId = new Map<number, HistoryItem>();
  for (const event of invitedEvents ?? []) {
    byId.set(event.id, {
      event,
      status: event.invitees[0]?.rsvp ?? "PENDING",
    });
  }
  for (const event of hostedEvents ?? []) {
    byId.set(event.id, { event, status: "HOST" });
  }

  return (
    <EventHistory
      title="My history"
      sectionTitles={{ upcoming: "Upcoming events", past: "Past events" }}
      items={[...byId.values()]}
      isLoading={isLoading}
      loadingFallback={<ProfileHistorySkeleton />}
      error={error && (error || "Couldn't load your event history.")}
      onRetry={onRetry}
      emptyText="Nothing here yet."
    />
  );
}
