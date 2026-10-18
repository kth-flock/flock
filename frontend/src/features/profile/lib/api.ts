import type { FriendshipStatus } from "@flock/shared/schemas/user";
import type { EventSummary, InvitedEvent } from "@/features/event/lib/types";
import { API_BASE_URL } from "@/shared/lib/api";
import type {
  PrivateUser,
  ProfileUser,
  PublicUser,
  SerializedUser,
} from "@/shared/types/user";
import { withCreatedAt } from "@/shared/lib/user";
import type {
  UserInfo,
  ChangeEmail,
  ChangePassword,
} from "@flock/shared/schemas/user";

async function fetchFromBackend<T>(path: string): Promise<T | null> {
  const res = await fetch(`${API_BASE_URL}${path}`, { credentials: "include" });

  if (res.status === 404) return null;

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? `Request to ${path} failed`);
  }

  return res.json();
}

async function fetchData<T>(path: string): Promise<T | null> {
  const response = await fetchFromBackend<{ data: T }>(path);
  return response?.data ?? null;
}

async function fetchFromBrowser<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? `Request to ${path} failed`);
  }

  return res.json();
}

function withEventDates<T extends EventSummary>(event: T): T {
  return {
    ...event,
    startsAt: new Date(event.startsAt),
    endsAt: event.endsAt && new Date(event.endsAt),
    createdAt: new Date(event.createdAt),
  };
}

export async function getProfile(
  profileId: number,
): Promise<ProfileUser | null> {
  const res = await fetch(`${API_BASE_URL}/users/${profileId}`, {
    credentials: "include",
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? `Failed to get profile`);
  }

  const response: { data: SerializedUser<ProfileUser> } = await res.json();
  return withCreatedAt(response.data);
}

export async function getMyProfile(
  cookie: string,
): Promise<PrivateUser | null> {
  const res = await fetch(`${API_BASE_URL}/me`, { headers: { cookie } });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to get your profile");

  const response: { data: SerializedUser<PrivateUser> } = await res.json();
  return withCreatedAt(response.data);
}

export async function getProfileFriends(
  profileId: number,
): Promise<PublicUser[] | null> {
  const res = await fetch(`${API_BASE_URL}/users/${profileId}/friends`, {
    credentials: "include",
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? `Failed to get profile friends`);
  }

  const response: { data: PublicUser[] } = await res.json();
  return response.data;
}

export async function getMyHostedEvents(
  cookie: string,
): Promise<EventSummary[]> {
  const events = await fetchFromBackend<EventSummary[]>("/events/created");
  return (events ?? []).map(withEventDates);
}

export async function getMyInvitedEvents(
  cookie: string,
): Promise<InvitedEvent[]> {
  const events = await fetchFromBackend<InvitedEvent[]>("/events/invited");
  return (events ?? []).map(withEventDates);
}

export async function getMyHostedEventsClient(): Promise<EventSummary[]> {
  const events = await fetchFromBrowser<EventSummary[]>("/events/created");
  return events.map(withEventDates);
}

export async function getMyInvitedEventsClient(): Promise<InvitedEvent[]> {
  const events = await fetchFromBrowser<InvitedEvent[]>("/events/invited");
  return events.map(withEventDates);
}

export async function getEventsTogether(
  profileId: number,
): Promise<InvitedEvent[]> {
  const events = await fetchData<InvitedEvent[]>(
    `/users/${profileId}/events-together`,
  );
  return (events ?? []).map(withEventDates);
}

export async function getMyFriendshipStatuses(): Promise<
  Map<number, FriendshipStatus>
> {
  const [friends, sent, received] = await Promise.all([
    fetchData<PublicUser[]>("/me/friendships"),
    fetchData<PublicUser[]>("/me/friendships/requests?direction=sent"),
    fetchData<PublicUser[]>("/me/friendships/requests?direction=received"),
  ]);

  const statuses = new Map<number, FriendshipStatus>();
  received?.forEach((user) => statuses.set(user.id, "REQUEST_RECEIVED"));
  sent?.forEach((user) => statuses.set(user.id, "REQUEST_SENT"));
  friends?.forEach((user) => statuses.set(user.id, "FRIENDS"));
  return statuses;
}

export async function orNull<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (err) {
    console.error(err);
    return null;
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

export async function updateMyInfo(data: UserInfo) {
  await patchMe("", data, "Failed to update your profile");
}

export async function changeEmail(data: ChangeEmail) {
  await patchMe("/email", data, "Failed to change your email");
}

export async function changePassword(data: ChangePassword) {
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
