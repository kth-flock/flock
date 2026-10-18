import type { RsvpToEventData } from "@flock/shared/schemas/event";
import type { PublicUser } from "../types/user";
import { apiFetch, apiData } from "./https";

export const getMyFriends = () =>
  apiData<PublicUser[]>("/me/friendships", {
    fallbackError: "Failed to get friends",
  });

export const updateRsvp = (eventId: number, data: RsvpToEventData) =>
  apiFetch(`/events/${eventId}/rsvp`, {
    method: "PATCH",
    body: data,
    fallbackError: "Failed to save your answer",
  });

export async function inviteFriend(eventId: number, userId: number) {
  await apiFetch(`/events/${eventId}/invitees/${userId}`, {
    method: "POST",
    fallbackError: "Failed to invite user",
  });
}

export async function batchInvite(eventId: number, userIds: number[]) {
  const response = await apiData<{ skipped: number }>(
    `/events/${eventId}/invitees/}`,
    {
      method: "POST",
      body: { inviteeIds: userIds },
      fallbackError: "Failed to invite user",
    },
  );

  return response;
}

export async function uninviteFriend(eventId: number, userId: number) {
  await apiFetch(`/events/${eventId}/invitees/${userId}`, {
    method: "DELETE",
    fallbackError: "Failed to uninvite user",
  });
}

export async function removeFriendship(userId: number) {
  await apiFetch("/me/friendships", {
    method: "DELETE",
    body: { friendId: userId },
    fallbackError: "Failed to remove friendship",
  });
}

export async function sendFriendRequest(requesteeId: number) {
  await apiFetch(`/me/friendships/request`, {
    method: "POST",
    body: { requesteeId },
    fallbackError: "Failed to send friend request",
  });
}

export async function acceptFriendRequest(requesterId: number) {
  await apiFetch(`/me/friendships/request`, {
    method: "PATCH",
    body: { requesterId },
    fallbackError: "Failed to send friend request",
  });
}

export async function declineFriendRequest(friendId: number) {
  await apiFetch(`/me/friendships/request`, {
    method: "DELETE",
    body: { friendId },
    fallbackError: "Failed to send friend request",
  });
}
