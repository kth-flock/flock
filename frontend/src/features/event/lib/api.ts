import type { EventStatus } from "@/features/dashboard/components/eventPreview";
import { API_BASE_URL } from "@/shared/lib/api";
import type { EventSummary, InvitedEvent } from "./types";

export type UpcomingEvent = { event: EventSummary; status: EventStatus };

async function fetchEvents<T extends EventSummary>(path: string): Promise<T[]> {
  const res = await fetch(`${API_BASE_URL}${path}`, { credentials: "include" });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to get events");
  }

  const events: T[] = await res.json();
  return events.map((event) => ({
    ...event,
    startsAt: new Date(event.startsAt),
    endsAt: event.endsAt && new Date(event.endsAt),
    createdAt: new Date(event.createdAt),
  }));
}

export async function getUpcomingEvents(): Promise<UpcomingEvent[]> {
  const [hosted, invited] = await Promise.all([
    fetchEvents<EventSummary>("/events/created"),
    fetchEvents<InvitedEvent>("/events/invited"),
  ]);

  const now = Date.now();
  const hasEnded = (event: EventSummary) =>
    (event.endsAt ?? event.startsAt).getTime() < now;

  return [
    ...hosted.map((event) => ({ event, status: "HOST" as const })),
    ...invited.map((event) => ({
      event,
      status: event.invitees[0]?.rsvp ?? "PENDING",
    })),
  ]
    .filter(({ event, status }) => !hasEnded(event) && status !== "DECLINED")
    .toSorted((a, b) => a.event.startsAt.getTime() - b.event.startsAt.getTime());
}
