import { prisma } from "../prisma";
import { publicUserInformationSelect } from "../utils/selectors";
import { EventId } from "@flock/shared/schemas/event";
import { UserId } from "@flock/shared/schemas/user";
import {
  AnnouncementId,
  CreateAnnouncementData,
  UpdateAnnouncementData,
} from "@flock/shared/schemas/announcement";
import { NotFoundError } from "../utils/errors";
import { assertEventHost } from "../utils/service";

async function assertAnnouncementInEvent(
  eventId: EventId,
  announcementId: AnnouncementId,
) {
  const announcement = await prisma.announcement.findUnique({
    where: { id: announcementId },
    select: { eventId: true },
  });

  if (!announcement || announcement.eventId !== eventId) {
    throw new NotFoundError("Update not found");
  }
}

export async function addAnnouncement(
  eventId: EventId,
  userId: UserId,
  announcementData: CreateAnnouncementData,
) {
  await assertEventHost(eventId, userId, "Only event host can create updates");

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
  await assertEventHost(eventId, userId, "Only event host can edit updates");
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
  await assertEventHost(eventId, userId, "Only event host can delete updates");
  await assertAnnouncementInEvent(eventId, announcementId);

  await prisma.announcement.delete({
    where: { id: announcementId },
  });
}
