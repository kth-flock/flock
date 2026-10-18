import type { EventStatus } from "@/features/dashboard/components/eventPreview";
import type { EventSummary, InvitedEvent } from "./types";
import type { CalendarEvent } from "@/features/calendar/lib/types";
import type { ExtendedEvent } from "@/shared/types/event";
import type { Serialized } from "@/shared/types/serialized";
import { apiFetch } from "@/shared/lib/https";

export type UpcomingEvent = { event: EventSummary; status: EventStatus };

type EventDateFields = Pick<EventSummary, "startsAt" | "endsAt" | "createdAt">;

export const withEventDates = <T extends EventDateFields>(
  e: Serialized<T>,
): T =>
  ({
    ...e,
    startsAt: new Date(e.startsAt),
    endsAt: e.endsAt === null ? null : new Date(e.endsAt),
    createdAt: new Date(e.createdAt),
  }) as T;

export const getEvent = async (eventId: number): Promise<ExtendedEvent> => {
  const event = await apiFetch<Serialized<ExtendedEvent>>(`/events/${eventId}`);
  const datedEvent = withEventDates<ExtendedEvent>(event);

  return {
    ...datedEvent,
    invitees: datedEvent.invitees.map((invitee) => ({
      ...invitee,
      createdAt: new Date(invitee.createdAt),
      updatedAt: invitee.updatedAt ? new Date(invitee.updatedAt) : null,
    })),
    announcements: datedEvent.announcements.map((announcement) => ({
      ...announcement,
      createdAt: new Date(announcement.createdAt),
      comments: announcement.comments.map((comment) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
      })),
    })),
  };
};

async function fetchEvents<T extends EventSummary>(path: string): Promise<T[]> {
  const events = await apiFetch<Serialized<T>[]>(path);
  return events.map((event) => withEventDates<T>(event));
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
  fetchEvents<EventSummary>("/events/created");

export const getInvitedEvents = async () =>
  fetchEvents<InvitedEvent>("/events/invited");

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
