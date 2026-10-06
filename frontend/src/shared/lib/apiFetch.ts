import type { CreateEventData } from "@flock/shared/schemas/event";
import { RegisterUser } from "@flock/shared/schemas/auth";
import { UserSearchResult, PrivateUser } from "../types/user";
import type { ExtendedEvent } from "../types/event";

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

export async function registerFetch(data: RegisterUser) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
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

export async function getCurrentUser(): Promise<PrivateUser> {
  const res = await fetch(`${API_BASE_URL}/me`, {
    credentials: "include",
  });

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
