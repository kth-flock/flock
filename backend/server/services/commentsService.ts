import { prisma } from "../prisma";
import { publicUserInformationSelect } from "../utils/selectors";
import { EventId } from "@flock/shared/schemas/event";
import { UserId } from "@flock/shared/schemas/user";
import { AnnouncementId } from "@flock/shared/schemas/announcement";
import {
  CommentId,
  CreateCommentData,
  UpdateCommentData,
} from "@flock/shared/schemas/comment";
import { NotFoundError, ForbiddenError } from "../utils/errors";

async function getAccess(
  eventId: EventId,
  announcementId: AnnouncementId,
  userId: UserId,
) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      createdById: true,
      invitees: { where: { userId }, select: { userId: true } },
    },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  const announcement = await prisma.announcement.findUnique({
    where: { id: announcementId },
    select: { eventId: true },
  });

  if (!announcement || announcement.eventId !== eventId) {
    throw new NotFoundError("Update not found");
  }

  return {
    isHost: event.createdById === userId,
    isInvited: event.invitees.length > 0,
  };
}

async function getCommentInAnnouncement(
  announcementId: AnnouncementId,
  commentId: CommentId,
) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { announcementId: true, userId: true },
  });

  if (!comment || comment.announcementId !== announcementId) {
    throw new NotFoundError("Reply not found");
  }

  return comment;
}

export async function addComment(
  eventId: EventId,
  announcementId: AnnouncementId,
  userId: UserId,
  commentData: CreateCommentData,
) {
  const { isHost, isInvited } = await getAccess(
    eventId,
    announcementId,
    userId,
  );

  if (!isHost && !isInvited) {
    throw new ForbiddenError("Only the host and invitees can reply");
  }

  return prisma.comment.create({
    data: { ...commentData, announcementId, userId },
    include: { user: { select: publicUserInformationSelect } },
  });
}

export async function updateComment(
  eventId: EventId,
  announcementId: AnnouncementId,
  commentId: CommentId,
  userId: UserId,
  commentData: UpdateCommentData,
) {
  await getAccess(eventId, announcementId, userId);
  const comment = await getCommentInAnnouncement(announcementId, commentId);

  if (comment.userId !== userId) {
    throw new ForbiddenError("You can only edit your own reply");
  }

  return prisma.comment.update({
    where: { id: commentId },
    data: commentData,
    include: { user: { select: publicUserInformationSelect } },
  });
}

export async function deleteComment(
  eventId: EventId,
  announcementId: AnnouncementId,
  commentId: CommentId,
  userId: UserId,
) {
  const { isHost } = await getAccess(eventId, announcementId, userId);
  const comment = await getCommentInAnnouncement(announcementId, commentId);

  if (comment.userId !== userId && !isHost) {
    throw new ForbiddenError("You can only delete your own reply");
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });
}
