export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function getCreatedEvents() {
  const res = await fetch(`${API_BASE_URL}/events/created`, {
    credentials: "include",
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to load events");
  }

  return res.json();
}

export async function getInvitedEvents() {
  const res = await fetch(`${API_BASE_URL}/events/invited`, {
    credentials: "include",
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to load events");
  }

  return res.json();
}
