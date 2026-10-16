import { RegisterUser, LoginUser } from "@flock/shared/schemas/auth";
import type { ChangeEmail, ChangePassword, UserInfo } from "@flock/shared/schemas/user";
import type {
  CreateEventData,
  RsvpToEventData,
  UpdateEventData,
} from "@flock/shared/schemas/event";
import { UserSearchResult, PrivateUser, PublicUser } from "../types/user";
import type { ExtendedEvent } from "../types/event";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function createEventFetch(
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

export async function updateEventFetch(
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

export async function inviteFriendFetch(eventId: number, userId: number) {
  const res = await fetch(
    `${API_BASE_URL}/events/${eventId}/invitees/${userId}`,
    { method: "POST", credentials: "include" },
  );

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to invite user");
  }
}

export async function rsvpFetch(eventId: number, data: RsvpToEventData) {
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

export async function batchInviteFetch(eventId: number, userIds: number[]) {
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

export async function uninviteFriendFetch(eventId: number, userId: number) {
  const res = await fetch(
    `${API_BASE_URL}/events/${eventId}/invitees/${userId}`,
    { method: "DELETE", credentials: "include" },
  );

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to uninvite user");
  }
}

export async function removeFriendshipFetch(userId: number) {
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

async function patchMe(path: string, body: unknown, fallbackError: string) {
  const res = await fetch(`${API_BASE_URL}/me${path}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? fallbackError);
  }
}

export async function updateMyInfoFetch(data: UserInfo) {
  await patchMe("", data, "Failed to update your profile");
}

export async function changeEmailFetch(data: ChangeEmail) {
  await patchMe("/email", data, "Failed to change your email");
}

export async function changePasswordFetch(data: ChangePassword) {
  await patchMe("/password", data, "Failed to change your password");
}

export async function deleteMyAccountFetch() {
  const res = await fetch(`${API_BASE_URL}/me`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to delete your account");
  }
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
  const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to load event");
  }

  return res.json();
}

export async function getAllEventsFetch() {
  const res = await fetch(`${API_BASE_URL}/events/`, {
    credentials: "include",
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to load events");
  }

  return res.json();
}

export async function registerFetch(data: RegisterUser) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();

    throw new Error(error.error ?? "Couldn't register your account.");
  }

  const response: {
    status: string;
    data: { user: PrivateUser };
  } = await res.json();

  return response.data;
}

export async function sendFriendRequestFetch(requesteeId: number) {
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

export async function acceptFriendRequestFetch(requesterId: number) {
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

export async function declineFriendRequestFetch(friendId: number) {
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

export async function loginFetch(data: LoginUser) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();

    throw new Error(error.error ?? "Couldn't login");
  }

  const response: {
    status: string;
    data: { user: PrivateUser };
  } = await res.json();

  return response.data;
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

  const response: { status: string; data: PrivateUser } = await res.json();

  return response.data;
}

export async function getEvent(
  eventId: number,
  cookie?: string,
): Promise<ExtendedEvent> {
  const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    credentials: "include",
    headers: cookie ? { cookie } : {},
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to get event");
  }

  return res.json();
}
