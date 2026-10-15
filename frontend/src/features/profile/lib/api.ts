import type { FriendshipStatus } from "@flock/shared/schemas/user";
import type { EventSummary, InvitedEvent } from "@/features/event/lib/types";
import { API_BASE_URL } from "@/shared/lib/api";
import type { PublicUser } from "@/shared/types/user";
import * as example from "./exampleApi";
import type { MyProfileDetails, ProfileDetails } from "./types";

// Set USE_EXAMPLE_DATA=true in frontend/.env to use the example data instead of the backend, e.g. to work on the layout without running it
const USE_EXAMPLE_DATA = process.env.USE_EXAMPLE_DATA === "true";

// These run on the server, so the login cookie has to be passed along by hand.
async function fetchFromBackend<T>(
  path: string,
  cookie: string,
): Promise<T | null> {
  const res = await fetch(`${API_BASE_URL}${path}`, { headers: { cookie } });

  if (res.status === 404) return null;

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? `Request to ${path} failed`);
  }

  return res.json();
}

async function fetchData<T>(path: string, cookie: string): Promise<T | null> {
  const response = await fetchFromBackend<{ data: T }>(path, cookie);
  return response?.data ?? null;
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
  profileId: string,
  cookie: string,
): Promise<ProfileDetails | null> {
  if (USE_EXAMPLE_DATA) return example.getProfile(profileId);
  return fetchData<ProfileDetails>(`/users/${profileId}`, cookie);
}

export async function getMyProfile(
  cookie: string,
): Promise<MyProfileDetails | null> {
  if (USE_EXAMPLE_DATA) return example.getMyProfile();

  const res = await fetch(`${API_BASE_URL}/me`, { headers: { cookie } });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to get your profile");

  const response: { data: MyProfileDetails } = await res.json();
  return response.data;
}

export async function getProfileFriends(
  profileId: number,
  cookie: string,
): Promise<PublicUser[]> {
  if (USE_EXAMPLE_DATA) return example.getProfileFriends(profileId);
  return (
    (await fetchData<PublicUser[]>(`/users/${profileId}/friends`, cookie)) ?? []
  );
}

export async function getMyHostedEvents(
  cookie: string,
): Promise<EventSummary[]> {
  if (USE_EXAMPLE_DATA) return example.getMyHostedEvents();
  const events = await fetchFromBackend<EventSummary[]>(
    "/events/created",
    cookie,
  );
  return (events ?? []).map(withEventDates);
}

export async function getMyInvitedEvents(
  cookie: string,
): Promise<InvitedEvent[]> {
  if (USE_EXAMPLE_DATA) return example.getMyInvitedEvents();
  const events = await fetchFromBackend<InvitedEvent[]>(
    "/events/invited",
    cookie,
  );
  return (events ?? []).map(withEventDates);
}

export async function getEventsTogether(
  profileId: number,
  cookie: string,
): Promise<InvitedEvent[]> {
  if (USE_EXAMPLE_DATA) return example.getEventsTogether(profileId);
  const events = await fetchData<InvitedEvent[]>(
    `/users/${profileId}/events-together`,
    cookie,
  );
  return (events ?? []).map(withEventDates);
}

export async function getMyFriendshipStatuses(
  cookie: string,
): Promise<Map<number, FriendshipStatus>> {
  if (USE_EXAMPLE_DATA) return example.getMyFriendshipStatuses();

  const [friends, sent, received] = await Promise.all([
    fetchData<PublicUser[]>("/me/friendships", cookie),
    fetchData<PublicUser[]>("/me/friendships/requests?direction=sent", cookie),
    fetchData<PublicUser[]>(
      "/me/friendships/requests?direction=received",
      cookie,
    ),
  ]);

  const statuses = new Map<number, FriendshipStatus>();
  received?.forEach((user) => statuses.set(user.id, "REQUEST_RECEIVED"));
  sent?.forEach((user) => statuses.set(user.id, "REQUEST_SENT"));
  friends?.forEach((user) => statuses.set(user.id, "FRIENDS"));
  return statuses;
}
