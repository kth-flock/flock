import { apiFetch } from "@/shared/lib/https";
import { EventId } from "@flock/shared/schemas/event";
import {
  UpdateAnnouncementData,
  CreateAnnouncementData,
  AnnouncementId,
} from "@flock/shared/schemas/announcement";

export async function createAnnouncement(
  eventId: EventId,
  payload: CreateAnnouncementData,
): Promise<{ id: number }> {
  return await apiFetch<{ id: number }>(`/events/${eventId}/announcements`, {
    method: "POST",
    body: payload,
    fallbackError: "Couldn't create announcement",
  });
}

export async function updateAnnouncement(
  eventId: EventId,
  announcementId: AnnouncementId,
  payload: UpdateAnnouncementData,
): Promise<{ id: number }> {
  return await apiFetch<{ id: number }>(
    `/events/${eventId}/announcements/${announcementId}`,
    {
      method: "PATCH",
      body: payload,
      fallbackError: "Couldn't update announcement",
    },
  );
}

export async function deleteAnnouncement(
  eventId: EventId,
  announcementId: AnnouncementId,
) {
  await apiFetch(`/events/${eventId}/announcements/${announcementId}`, {
    method: "DELETE",
    fallbackError: "Couldn't delete announcement",
  });
}
