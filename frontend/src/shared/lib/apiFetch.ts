import type { CreateEventData } from "@flock/shared/schemas/event";

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
