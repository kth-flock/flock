import type { FriendshipStatus } from "@flock/shared/schemas/user";
import type { EventSummary, InvitedEvent } from "@/features/event/lib/types";
import { API_BASE_URL } from "@/shared/lib/api";
import type { PublicUser } from "@/shared/types/user";
import * as example from "./exampleApi";
import type { ProfileDetails } from "./types";

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

// Most endpoints wrap their result as { status, data }
async function fetchData<T>(path: string, cookie: string): Promise<T | null> {
  const response = await fetchFromBackend<{ data: T }>(path, cookie);
  return response?.data ?? null;
}

// Dates arrive as ISO strings, but the event types use Date objects
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
): Promise<ProfileDetails | null> {
  if (USE_EXAMPLE_DATA) return example.getMyProfile();

  const res = await fetch(`${API_BASE_URL}/me`, { headers: { cookie } });
  // Not logged in (or the login has expired)
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to get your profile");

  const response: { data: ProfileDetails } = await res.json();
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
export async function getFriendshipStatus(
  profileId: number,
  cookie: string,
): Promise<FriendshipStatus> {
  if (USE_EXAMPLE_DATA) return example.getFriendshipStatus(profileId);

  const [friends, sent, received] = await Promise.all([
    fetchData<PublicUser[]>("/me/friendships", cookie),
    fetchData<PublicUser[]>("/me/friendships/requests?direction=sent", cookie),
    fetchData<PublicUser[]>(
      "/me/friendships/requests?direction=received",
      cookie,
    ),
  ]);

  const includesProfile = (users: PublicUser[] | null) =>
    users?.some((user) => user.id === profileId) ?? false;

  if (includesProfile(friends)) return "FRIENDS";
  if (includesProfile(sent)) return "REQUEST_SENT";
  if (includesProfile(received)) return "REQUEST_RECEIVED";
  return "NONE";
}
