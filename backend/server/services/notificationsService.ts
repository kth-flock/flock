import { prisma } from "../prisma";
import { UserId } from "@flock/shared/schemas/user";
import { STATUS } from "../../prisma/generated/enums";
import { publicUserInformationSelect } from "../utils/selectors";
import type { Notification } from "@flock/shared/schemas/notifications";

// Max rows fetched per notification type
const NOTIFICATIONS_PER_TYPE = 20;
// Max notifications returned to the client after merging
const NOTIFICATIONS_LIMIT = 20;

export async function getNotifications(
  userId: UserId,
): Promise<Notification[]> {
  const results = await Promise.all([
    getInvitationNotifications(userId),
    getAnnouncementNotifications(userId),
    getCommentNotifications(userId),
    getFriendRequestNotifications(userId),
    getAcceptedFriendRequestNotifications(userId),
  ]);

  return results
    .flat()
    .sort(
      (a, b) =>
        b.createdAt.getTime() - a.createdAt.getTime() ||
        a.id.localeCompare(b.id),
    )
    .slice(0, NOTIFICATIONS_LIMIT);
}

// Someone invited me to an event
async function getInvitationNotifications(
  userId: UserId,
): Promise<Notification[]> {
  const invitations = await prisma.invitee.findMany({
    where: {
      userId,
      event: { createdById: { not: userId } }, // skip self-invites
    },
    orderBy: { createdAt: "desc" },
    take: NOTIFICATIONS_PER_TYPE,
    select: {
      eventId: true,
      userId: true,
      createdAt: true,
      event: {
        select: {
          id: true,
          title: true,
          createdBy: { select: publicUserInformationSelect },
        },
      },
    },
  });

  // Filter is needed for TypeScript: Prisma still types createdAt as Date | null
  return invitations.flatMap((invitation) =>
    invitation.createdAt
      ? [
          {
            id: `invitation:${invitation.eventId}:${invitation.userId}`,
            type: "INVITATION" as const,
            createdAt: invitation.createdAt,
            from: invitation.event.createdBy,
            event: { id: invitation.event.id, title: invitation.event.title },
          },
        ]
      : [],
  );
}

// Someone else posted an announcement on an event I'm invited to
async function getAnnouncementNotifications(
  userId: UserId,
): Promise<Notification[]> {
  const announcements = await prisma.announcement.findMany({
    where: {
      userId: { not: userId },
      event: { invitees: { some: { userId } } },
    },
    orderBy: { createdAt: "desc" },
    take: NOTIFICATIONS_PER_TYPE,
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: publicUserInformationSelect },
      event: { select: { id: true, title: true } },
    },
  });

  return announcements.map((announcement) => ({
    id: `announcement:${announcement.id}`,
    type: "ANNOUNCEMENT" as const,
    createdAt: announcement.createdAt,
    from: announcement.user,
    event: { id: announcement.event.id, title: announcement.event.title },
    announcement: { id: announcement.id, content: announcement.content },
  }));
}

// Someone else commented on an announcement on an event I'm invited to, or commented to an announcement on my event:
async function getCommentNotifications(
  userId: UserId,
): Promise<Notification[]> {
  const comments = await prisma.comment.findMany({
    where: {
      userId: { not: userId },
      announcement: {
        event: {
          OR: [{ createdById: userId }, { invitees: { some: { userId } } }],
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: NOTIFICATIONS_PER_TYPE,
    select: {
      id: true,
      createdAt: true,
      user: { select: publicUserInformationSelect },
      announcement: {
        select: {
          id: true,
          content: true,
          event: { select: { id: true, title: true } },
        },
      },
    },
  });

  return comments.map((comment) => ({
    id: `comment:${comment.id}`,
    type: "ANNOUNCEMENT_COMMENT" as const,
    createdAt: comment.createdAt,
    from: comment.user,
    event: {
      id: comment.announcement.event.id,
      title: comment.announcement.event.title,
    },
    announcement: {
      id: comment.announcement.id,
      content: comment.announcement.content,
    },
  }));
}

// Someone sent me a friend request that is still pending
async function getFriendRequestNotifications(
  userId: UserId,
): Promise<Notification[]> {
  const friendRequests = await prisma.friendship.findMany({
    where: { requesteeId: userId, status: STATUS.PENDING },
    orderBy: { createdAt: "desc" },
    take: NOTIFICATIONS_PER_TYPE,
    select: {
      requesterId: true,
      requesteeId: true,
      createdAt: true,
      requester: { select: publicUserInformationSelect },
    },
  });

  return friendRequests.map((friendship) => ({
    id: `friend-request:${friendship.requesterId}:${friendship.requesteeId}`,
    type: "FRIEND_REQUEST" as const,
    createdAt: friendship.createdAt,
    from: friendship.requester,
  }));
}

// Someone accepted a friend request I sent
async function getAcceptedFriendRequestNotifications(
  userId: UserId,
): Promise<Notification[]> {
  const acceptedRequests = await prisma.friendship.findMany({
    where: {
      requesterId: userId,
      status: STATUS.ACCEPTED,
      updatedAt: { not: null },
    },
    orderBy: { updatedAt: "desc" },
    take: NOTIFICATIONS_PER_TYPE,
    select: {
      requesterId: true,
      requesteeId: true,
      updatedAt: true,
      requestee: { select: publicUserInformationSelect },
    },
  });

  // Filter is needed for TypeScript: Prisma still types updatedAt as Date | null
  return acceptedRequests.flatMap((friendship) =>
    friendship.updatedAt
      ? [
          {
            id: `friendship-accepted:${friendship.requesterId}:${friendship.requesteeId}`,
            type: "FRIEND_REQUEST_ACCEPTED" as const,
            createdAt: friendship.updatedAt,
            from: friendship.requestee,
          },
        ]
      : [],
  );
}
