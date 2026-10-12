import { RegisterUser } from "@flock/shared/schemas/auth";
import type {
  CreateEventData,
  UpdateEventData,
} from "@flock/shared/schemas/event";
import { UserSearchResult, PrivateUser } from "../types/user";
import type { ExtendedEvent } from "../types/event";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

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

export async function updateEventFetch(
  eventId: number,
  payload: UpdateEventData,
): Promise<{ id: number }> {
  const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "PATCH",
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
export async function deleteImageFromS3Fetch(imageUrl: string) {
  await fetch(`${API_BASE_URL}/image`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl }),
  });
}

export async function getEventByIdFetch(
  eventId: string,
): Promise<ExtendedEvent> {
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

export async function registerFetch(data: RegisterUser) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.error ?? "Couldn't register your account.");
  }

  return response.json();
}

export async function getCurrentUser(): Promise<PrivateUser | null> {
  const res = await fetch(`${API_BASE_URL}/me`, {
    credentials: "include",
  });

  if (res.status === 401) return null;

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to get current user");
  }

  const response: { status: string; data: PrivateUser } = await res.json();

  return response.data;
}

export async function getEvent(eventId: number): Promise<ExtendedEvent> {
  const res = await fetch(`${API_BASE_URL}/events/${eventId}`);

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to get event");
  }

  return res.json();
}
