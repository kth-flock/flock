import { API_BASE_URL } from "@/shared/lib/api";
import type { CreateEventData } from "@flock/shared/schemas/event";
import type { UpdateEventData } from "@flock/shared/schemas/event";

export async function createEvent(
  payload: CreateEventData,
): Promise<{ id: number }> {
  const res = await fetch(`${API_BASE_URL}/events`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to create event");
  }

  const response: { id: number } = await res.json();
  return response;
}

export async function updateEvent(
  eventId: number,
  payload: UpdateEventData,
): Promise<{ id: number }> {
  const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to update event");
  }

  const response: { id: number } = await res.json();
  return response;
}

export async function deleteEvent(eventId: number) {
  const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to delete event");
  }
}
