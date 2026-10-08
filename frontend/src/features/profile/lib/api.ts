import {
  exampleEvents,
  exampleFriendships,
  exampleInvitees,
  exampleProfiles,
} from "@/features/event/lib/exampleData";
import type {
  EventDetails,
  EventSummary,
  InvitedEvent,
} from "@/features/event/lib/types";
import type { PublicUser } from "@/shared/types/user";
import type { FriendshipStatus } from "@flock/shared/schemas/user";
import type { ProfileDetails } from "./types";

// TODO: fetch from the backend (GET /users/:userId), see shared/lib/apiFetch.ts.
// Until then this only knows the example profiles. Returns null when the
// profile doesn't exist.
export async function getProfile(
  profileId: string,
): Promise<ProfileDetails | null> {
  return (
    exampleProfiles.find((profile) => profile.id === Number(profileId)) ?? null
  );
}

// TODO: fetch from the backend (GET /me), forwarding the token cookie. Until
// then the first example profile is the logged in user. Returns null when not
// logged in.
export async function getMyProfile(): Promise<ProfileDetails | null> {
  return exampleProfiles[0];
}

// TODO: fetch from the backend (GET /users/:userId/friends). Until then the
// friends are worked out from the example friendships, like the backend does.
export async function getProfileFriends(
  profileId: number,
): Promise<PublicUser[]> {
  const friendIds = exampleFriendships
    .filter(
      ({ requesterId, requesteeId, status }) =>
        status === "ACCEPTED" &&
        (requesterId === profileId || requesteeId === profileId),
    )
    .map(({ requesterId, requesteeId }) =>
      requesterId === profileId ? requesteeId : requesterId,
    );

  return exampleProfiles.filter((profile) => friendIds.includes(profile.id));
}

// The event list endpoints leave out the announcements, and the hosted one
// the host as well
const toEventSummary = (event: EventDetails): EventSummary => ({
  id: event.id,
  createdById: event.createdById,
  title: event.title,
  description: event.description,
  locationName: event.locationName,
  googlePlaceId: event.googlePlaceId,
  startsAt: event.startsAt,
  endsAt: event.endsAt,
  imageUrl: event.imageUrl,
});

const toInvitedEvent = (event: EventDetails): InvitedEvent => ({
  ...toEventSummary(event),
  createdBy: event.createdBy,
});

// TODO: fetch from the backend (GET /events/createdBy/:userId)
export async function getHostedEvents(
  profileId: number,
): Promise<EventSummary[]> {
  return exampleEvents
    .filter((event) => event.createdById === profileId)
    .map(toEventSummary);
}

// TODO: fetch from the backend (GET /events/invited/:userId). It doesn't
// include the RSVP, so there's no telling which of these the user attended.
export async function getInvitedEvents(
  profileId: number,
): Promise<InvitedEvent[]> {
  const eventIds = exampleInvitees
    .filter((invitee) => invitee.userId === profileId)
    .map((invitee) => invitee.eventId);

  return exampleEvents
    .filter((event) => eventIds.includes(event.id))
    .map(toInvitedEvent);
}

// TODO: fetch from the backend, which has no endpoint for this yet (only the
// user search returns a friendship status). Until then it's worked out from
// the example friendships, between the logged in user and the profile.
export async function getFriendshipStatus(
  myId: number,
  profileId: number,
): Promise<FriendshipStatus> {
  const friendship = exampleFriendships.find(
    ({ requesterId, requesteeId }) =>
      (requesterId === myId && requesteeId === profileId) ||
      (requesterId === profileId && requesteeId === myId),
  );

  if (!friendship) return "NONE";
  if (friendship.status === "ACCEPTED") return "FRIENDS";
  return friendship.requesterId === myId ? "REQUEST_SENT" : "REQUEST_RECEIVED";
}
