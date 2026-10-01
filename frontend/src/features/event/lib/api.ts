import { exampleEvent } from "./exampleData";
import type { EventDetails } from "./types";

// TODO: fetch from the backend (GET /events/:eventId) once we've agreed on how
// API calls are made, see shared/lib/apiFetch.ts. Until then this only knows
// the example event. Returns null when the event doesn't exist.
export async function getEvent(eventId: string): Promise<EventDetails | null> {
  return Number(eventId) === exampleEvent.id ? exampleEvent : null;
}
