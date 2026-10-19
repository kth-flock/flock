import { prisma } from "../prisma";
import { publicUserInformationSelect } from "../utils/selectors";
import { EventId } from "@flock/shared/schemas/event";
import { UserId } from "@flock/shared/schemas/user";
import {
  AnnouncementId,
  CreateAnnouncementData,
  UpdateAnnouncementData,
} from "@flock/shared/schemas/announcement";
import { NotFoundError, ForbiddenError } from "../utils/errors";

async function assertHost(eventId: EventId, userId: UserId) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { createdById: true },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  if (event.createdById !== userId) {
    throw new ForbiddenError("Only the host can manage announcements");
  }
}

async function assertAnnouncementInEvent(
  eventId: EventId,
  announcementId: AnnouncementId,
) {
  const announcement = await prisma.announcement.findUnique({
    where: { id: announcementId },
    select: { eventId: true },
  });

  if (!announcement || announcement.eventId !== eventId) {
    throw new NotFoundError("Announcement not found");
  }
}

export async function addAnnouncement(
  eventId: EventId,
  userId: UserId,
  announcementData: CreateAnnouncementData,
) {
  await assertHost(eventId, userId);

  return prisma.announcement.create({
    data: { ...announcementData, eventId, userId },
    include: { user: { select: publicUserInformationSelect } },
  });
}

export async function updateAnnouncement(
  eventId: EventId,
  announcementId: AnnouncementId,
  userId: UserId,
  announcementData: UpdateAnnouncementData,
) {
  await assertHost(eventId, userId);
  await assertAnnouncementInEvent(eventId, announcementId);

  return prisma.announcement.update({
    where: { id: announcementId },
    data: announcementData,
    include: { user: { select: publicUserInformationSelect } },
  });
}

export async function deleteAnnouncement(
  eventId: EventId,
  announcementId: AnnouncementId,
  userId: UserId,
) {
  await assertHost(eventId, userId);
  await assertAnnouncementInEvent(eventId, announcementId);

  await prisma.announcement.delete({
    where: { id: announcementId },
  });
}
