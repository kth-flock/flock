import type { EventStatus } from "@/features/dashboard/components/eventPreview";
import type { EventSummary, InvitedEvent } from "./types";
import type { CalendarEvent } from "@/features/calendar/lib/types";
import type { ExtendedEvent } from "@/shared/types/event";
import { apiFetch } from "@/shared/lib/https";

export type UpcomingEvent = { event: EventSummary; status: EventStatus };

export const withEventDates = <T extends EventSummary>(e: T): T => ({
  ...e,
  startsAt: new Date(e.startsAt),
  endsAt: e.endsAt && new Date(e.endsAt),
  createdAt: new Date(e.createdAt),
});

export const getEvent = async (eventId: number) =>
  await apiFetch<ExtendedEvent[]>(`/events/${eventId}`);

async function fetchEvents<T extends EventSummary>(path: string): Promise<T[]> {
  const events = await apiFetch<T[]>(path);

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
    .toSorted(
      (a, b) => a.event.startsAt.getTime() - b.event.startsAt.getTime(),
    );
}

export const getCreatedEvents = async () =>
  (await apiFetch<EventSummary[]>("/events/created")).map(withEventDates);

export const getInvitedEvents = async () =>
  (await apiFetch<InvitedEvent[]>("/events/invited")).map(withEventDates);

export const getMyEvents = async (): Promise<CalendarEvent[]> => {
  const [invited, created] = await Promise.all([
    getInvitedEvents(),
    getCreatedEvents(),
  ]);

  const byId = new Map<number, CalendarEvent>();
  for (const event of invited) byId.set(event.id, event);
  for (const event of created) byId.set(event.id, { ...event, invitees: [] });

  return [...byId.values()];
};
