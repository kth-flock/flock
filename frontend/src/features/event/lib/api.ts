import { exampleEvents } from "./exampleData";
import type { EventDetails } from "./types";

// TODO: fetch from the backend (GET /events/:eventId) once we've agreed on how
// API calls are made, see shared/lib/apiFetch.ts. Until then this only knows
// the example events. Returns null when the event doesn't exist.
export async function getEvent(eventId: string): Promise<EventDetails | null> {
  return exampleEvents.find((event) => event.id === Number(eventId)) ?? null;
}

// TODO: fetch from the backend. Returns the example events, soonest first.
export async function getUpcomingEvents(): Promise<EventDetails[]> {
  // return [];
  return exampleEvents.toSorted((a, b) => a.startsAt.localeCompare(b.startsAt));
}
