import { apiFetch } from "@/shared/lib/https";
import { EventId } from "@flock/shared/schemas/event";
import {
  UpdateAnnouncementData,
  CreateAnnouncementData,
  AnnouncementId,
} from "@flock/shared/schemas/announcement";
import {
  UpdateCommentData,
  CreateCommentData,
  CommentId,
} from "@flock/shared/schemas/comment";

export async function createAnnouncement(
  eventId: EventId,
  payload: CreateAnnouncementData,
): Promise<{ id: number }> {
  return await apiFetch<{ id: number }>(`/events/${eventId}/announcements`, {
    method: "POST",
    body: payload,
    fallbackError: "Couldn't create update",
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
      fallbackError: "Couldn't edit update",
    },
  );
}

export async function deleteAnnouncement(
  eventId: EventId,
  announcementId: AnnouncementId,
) {
  await apiFetch(`/events/${eventId}/announcements/${announcementId}`, {
    method: "DELETE",
    fallbackError: "Couldn't delete update",
  });
}

export async function createComment(
  eventId: EventId,
  announcementId: AnnouncementId,
  payload: CreateCommentData,
): Promise<{ id: number }> {
  return await apiFetch<{ id: number }>(
    `/events/${eventId}/announcements/${announcementId}/comments`,
    {
      method: "POST",
      body: payload,
      fallbackError: "Couldn't post reply",
    },
  );
}

export async function updateComment(
  eventId: EventId,
  announcementId: AnnouncementId,
  commentId: CommentId,
  payload: UpdateCommentData,
): Promise<{ id: number }> {
  return await apiFetch<{ id: number }>(
    `/events/${eventId}/announcements/${announcementId}/comments/${commentId}`,
    {
      method: "PATCH",
      body: payload,
      fallbackError: "Couldn't edit reply",
    },
  );
}

export async function deleteComment(
  eventId: EventId,
  announcementId: AnnouncementId,
  commentId: CommentId,
) {
  await apiFetch(
    `/events/${eventId}/announcements/${announcementId}/comments/${commentId}`,
    {
      method: "DELETE",
      fallbackError: "Couldn't delete reply",
    },
  );
}
