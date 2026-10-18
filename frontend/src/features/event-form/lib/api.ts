import type { CreateEventData } from "@flock/shared/schemas/event";
import type { UpdateEventData } from "@flock/shared/schemas/event";
import { apiFetch } from "@/shared/lib/https";

export async function createEvent(
  payload: CreateEventData,
): Promise<{ id: number }> {
  return await apiFetch<{ id: number }>("/events", {
    method: "POST",
    body: payload,
    fallbackError: "Couldn't create event",
  });
}

export async function updateEvent(
  eventId: number,
  payload: UpdateEventData,
): Promise<{ id: number }> {
  return await apiFetch<{ id: number }>(`/events/${eventId}`, {
    method: "PATCH",
    body: payload,
    fallbackError: "Couldn't update event",
  });
}

export async function deleteEvent(eventId: number) {
  await apiFetch(`/events/${eventId}`, {
    method: "DELETE",
    fallbackError: "Couldn't delete event",
  });
}
