import type { CreateEventData } from "@flock/shared/schemas/event";
import { UserSearchResult } from "../types/user";
import { EventDetails } from "@/features/event/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function geocodeFetch<T>(
  path: "search" | "reverse",
  params: Record<string, string>,
): Promise<T> {
  const res = await fetch(
    `${API_BASE_URL}/geocode/${path}?${new URLSearchParams(params)}`,
  );
  if (!res.ok) throw new Error(`Geocoding ${path} failed`);

  const response: { status: string; data: T } = await res.json();
  if (response.status !== "Success") {
    throw new Error(`Geocoding ${path} failed`);
  }
  return response.data;
}

export async function createEventFetch(
  payload: CreateEventData,
): Promise<{ id: number }> {
  const res = await fetch(`${API_BASE_URL}/events`, {
    method: "POST",
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

export async function searchUsersFetch(
  query: string,
): Promise<UserSearchResult[]> {
  const params = new URLSearchParams({ query });
  const res = await fetch(`${API_BASE_URL}/users/search?${params}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to search users");
  }

  const response: { status: string; data: UserSearchResult[] } =
    await res.json();

  return response.data;
}

export async function uploadImageFetch(
  file: File,
  folder: "events" | "profiles",
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch(`${API_BASE_URL}/image/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to upload image");
  }

  return res.json();
}

// should maybe not live here?
export async function deleteImageFromS3Fetch(imgKey: string) {
  await fetch(`${API_BASE_URL}/image`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imgKey }),
  });
}

export async function getEventByIdFetch(
  eventId: string,
): Promise<EventDetails> {
  const res = await fetch(`${API_BASE_URL}/events/${eventId}`);

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to load event");
  }

  return res.json();
}

export async function getAllEventsFetch() {
  const res = await fetch(`${API_BASE_URL}/events/`);

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to load events");
  }

  return res.json();
}
