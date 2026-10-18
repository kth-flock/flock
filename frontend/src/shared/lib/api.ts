import { RegisterUser, LoginUser } from "@flock/shared/schemas/auth";
import type {
  ChangeEmail,
  ChangePassword,
  UserInfo,
} from "@flock/shared/schemas/user";
import type { RsvpToEventData } from "@flock/shared/schemas/event";
import type {
  PrivateUser,
  PublicUser,
  SerializedUser,
} from "../types/user";
import type { ExtendedEvent } from "../types/event";
import { withCreatedAt } from "./user";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function getMyFriends(): Promise<PublicUser[]> {
  const res = await fetch(`${API_BASE_URL}/me/friendships/`, {
    credentials: "include",
  });
  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to get friends");
  }

  const response: { status: string; data: PublicUser[] } = await res.json();
  return response.data;
}

export async function updateRsvp(eventId: number, data: RsvpToEventData) {
  const res = await fetch(`${API_BASE_URL}/events/${eventId}/rsvp`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to save your answer");
  }
}

export async function inviteFriend(eventId: number, userId: number) {
  const res = await fetch(
    `${API_BASE_URL}/events/${eventId}/invitees/${userId}`,
    { method: "POST", credentials: "include" },
  );

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to invite user");
  }
}

export async function batchInvite(eventId: number, userIds: number[]) {
  const res = await fetch(`${API_BASE_URL}/events/${eventId}/invitees`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inviteeIds: userIds }),
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to invite users");
  }

  const response: { status: string; data: { skipped: number } } =
    await res.json();
  return response.data.skipped;
}

export async function uninviteFriend(eventId: number, userId: number) {
  const res = await fetch(
    `${API_BASE_URL}/events/${eventId}/invitees/${userId}`,
    { method: "DELETE", credentials: "include" },
  );

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to uninvite user");
  }
}

export async function removeFriendship(userId: number) {
  const res = await fetch(`${API_BASE_URL}/me/friendships`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ friendId: userId }),
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to remove friendship");
  }
}

export async function getAllEvents() {
  const res = await fetch(`${API_BASE_URL}/events/`, {
    credentials: "include",
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to load events");
  }

  return res.json();
}

export async function sendFriendRequest(requesteeId: number) {
  const res = await fetch(`${API_BASE_URL}/me/friendships/request`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requesteeId }),
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to send friend request");
  }
}

export async function acceptFriendRequest(requesterId: number) {
  const res = await fetch(`${API_BASE_URL}/me/friendships/request`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requesterId }),
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to accept friend request");
  }
}

export async function declineFriendRequest(friendId: number) {
  const res = await fetch(`${API_BASE_URL}/me/friendships/`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ friendId }),
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to decline friend request");
  }
}

export async function getCurrentUser(
  cookie?: string,
): Promise<PrivateUser | null> {
  const res = await fetch(`${API_BASE_URL}/me`, {
    credentials: "include",
    headers: cookie ? { cookie } : {},
  });

  if (res.status === 401) return null;

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to get current user");
  }

  const response: {
    status: string;
    data: SerializedUser<PrivateUser>;
  } = await res.json();

  return withCreatedAt(response.data);
}
