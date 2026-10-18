import type {
  ChangeEmail,
  ChangePassword,
  FriendshipStatus,
  UserInfo,
} from "@flock/shared/schemas/user";
import type { InvitedEvent } from "@/features/event/lib/types";
import { apiData, apiFetch, apiDataOrNull } from "@/shared/lib/https";
import { withCreatedAt } from "@/shared/lib/user";
import type { PublicUser, SerializedUser } from "@/shared/types/user";
import { withEventDates } from "@/features/event/lib/api";

export async function getProfile(id: number): Promise<PublicUser | null> {
  const user = await apiDataOrNull<SerializedUser<PublicUser>>(`/users/${id}`, {
    nullOn: [404],
    fallbackError: "Failed to get profile",
  });
  return user && withCreatedAt(user);
}

export function getProfileFriends(id: number) {
  return apiDataOrNull<PublicUser[]>(`/users/${id}/friends`, {
    nullOn: [404],
    fallbackError: "Failed to get profile friends",
  });
}

export async function getEventsTogether(
  profileId: number,
): Promise<InvitedEvent[]> {
  const events = await apiDataOrNull<InvitedEvent[]>(
    `/users/${profileId}/events-together`,
    { nullOn: [404], fallbackError: "Failed to get events together" },
  );
  return (events ?? []).map(withEventDates);
}

export async function getMyFriendshipStatuses(): Promise<
  Map<number, FriendshipStatus>
> {
  const [friends, sent, received] = await Promise.all([
    apiData<PublicUser[]>("/me/friendships"),
    apiData<PublicUser[]>("/me/friendships/requests", {
      query: { direction: "sent" },
    }),
    apiData<PublicUser[]>("/me/friendships/requests", {
      query: { direction: "received" },
    }),
  ]);

  const statuses = new Map<number, FriendshipStatus>();
  received.forEach((user) => statuses.set(user.id, "REQUEST_RECEIVED"));
  sent.forEach((user) => statuses.set(user.id, "REQUEST_SENT"));
  friends.forEach((user) => statuses.set(user.id, "FRIENDS"));
  return statuses;
}

function patchMe(path: string, body: unknown, fallbackError: string) {
  return apiFetch(`/me${path}`, { method: "PATCH", body, fallbackError });
}

export const updateMyInfo = (data: UserInfo) =>
  patchMe("", data, "Failed to update your profile");

export const changeEmail = (data: ChangeEmail) =>
  patchMe("/email", data, "Failed to change your email");

export const changePassword = (data: ChangePassword) =>
  patchMe("/password", data, "Failed to change your password");

export const deleteMyAccount = () =>
  apiFetch("/me", {
    method: "DELETE",
    fallbackError: "Failed to delete your account",
  });
