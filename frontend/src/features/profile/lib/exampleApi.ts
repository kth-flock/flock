import {
  exampleEvents,
  exampleFriendships,
  exampleInvitees,
  exampleProfiles,
} from "@/features/event/lib/exampleData";
import type { EventSummary, InvitedEvent } from "@/features/event/lib/types";
import type { ExtendedEvent } from "@/shared/types/event";
import type { PublicUser } from "@/shared/types/user";
import type { FriendshipStatus } from "@flock/shared/schemas/user";
import type { MyProfileDetails, ProfileDetails } from "./types";

// Example data versions of the functions in api.ts, used when
// USE_EXAMPLE_DATA=true so the profile pages work without the backend.
// The first example profile plays the logged in user.

const me = exampleProfiles[0];

export async function getProfile(
  profileId: string,
): Promise<ProfileDetails | null> {
  return (
    exampleProfiles.find((profile) => profile.id === Number(profileId)) ?? null
  );
}

export async function getMyProfile(): Promise<MyProfileDetails | null> {
  return { ...me, email: "felix@example.com" };
}

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

const toEventSummary = (event: ExtendedEvent): EventSummary => ({
  id: event.id,
  createdById: event.createdById,
  title: event.title,
  description: event.description,
  locationName: event.locationName,
  latitude: event.latitude,
  longitude: event.longitude,
  startsAt: event.startsAt,
  endsAt: event.endsAt,
  imageUrl: event.imageUrl,
  createdAt: event.createdAt,
});

const toInvitedEvent = (event: ExtendedEvent): InvitedEvent => ({
  ...toEventSummary(event),
  createdBy: event.createdBy,
  invitees: exampleInvitees
    .filter((invitee) => invitee.eventId === event.id && invitee.userId === me.id)
    .map(({ rsvp }) => ({ rsvp })),
});

export async function getMyHostedEvents(): Promise<EventSummary[]> {
  return exampleEvents
    .filter((event) => event.createdById === me.id)
    .map(toEventSummary);
}

export async function getMyInvitedEvents(): Promise<InvitedEvent[]> {
  const eventIds = exampleInvitees
    .filter((invitee) => invitee.userId === me.id)
    .map((invitee) => invitee.eventId);

  return exampleEvents
    .filter((event) => eventIds.includes(event.id))
    .map(toInvitedEvent);
}

export async function getFriendshipStatus(
  profileId: number,
): Promise<FriendshipStatus> {
  const friendship = exampleFriendships.find(
    ({ requesterId, requesteeId }) =>
      (requesterId === me.id && requesteeId === profileId) ||
      (requesterId === profileId && requesteeId === me.id),
  );

  if (!friendship) return "NONE";
  if (friendship.status === "ACCEPTED") return "FRIENDS";
  return friendship.requesterId === me.id ? "REQUEST_SENT" : "REQUEST_RECEIVED";
}
