import { prisma } from "../prisma";
import { RSVP } from "../../prisma/generated/enums";
import { publicUserInformationSelect } from "../utils/selectors";
import {
  CreateEventData,
  EventId,
  UpdateEventData,
  RsvpStatus,
} from "@flock/shared/schemas/event";
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
} from "../utils/errors";
import { UserId } from "@flock/shared/schemas/user";
import { deleteImageFromS3 } from "./imageService";
import { getUserById } from "./usersServices";
import { assertEventHost } from "../utils/service";

export async function getEventById(eventId: EventId, userId: UserId) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      createdBy: {
        select: publicUserInformationSelect,
      },

      invitees: {
        include: {
          user: {
            select: publicUserInformationSelect,
          },
        },
      },

      announcements: {
        include: {
          user: {
            select: publicUserInformationSelect,
          },
          comments: {
            include: {
              user: {
                select: publicUserInformationSelect,
              },
            },
          },
        },
      },
    },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  const isHost = event.createdById === userId;

  const isInvited = event.invitees.some((invitee) => invitee.userId === userId);

  if (!isHost && !isInvited) {
    throw new ForbiddenError("User is not authorized to view this event");
  }

  if (isHost) {
    return event;
  }

  return {
    ...event,
    invitees: event.invitees.map(({ rsvpComment, ...invitee }) =>
      invitee.userId === userId ? { ...invitee, rsvpComment } : invitee,
    ),
  };
}

export async function getCreatedEvents(userId: UserId) {
  const user = await getUserById(userId);

  const events = await prisma.event.findMany({
    where: { createdById: user.id },
  });

  return events;
}

export async function getInvitedEvents(userId: UserId) {
  const user = await getUserById(userId);

  const events = await prisma.event.findMany({
    where: {
      invitees: {
        some: {
          userId: user.id,
        },
      },
    },

    include: {
      createdBy: {
        select: publicUserInformationSelect,
      },
      invitees: {
        where: { userId: user.id },
        select: { rsvp: true },
      },
    },
  });
  return events;
}

export async function getEventsTogether(myId: UserId, otherId: UserId) {
  await getUserById(myId);

  const isParticipant = (userId: UserId) => ({
    OR: [
      { createdById: userId },
      { invitees: { some: { userId, rsvp: { not: RSVP.DECLINED } } } },
    ],
  });

  const events = await prisma.event.findMany({
    where: {
      AND: [isParticipant(myId), isParticipant(otherId)],
    },
    orderBy: { startsAt: "asc" },
    include: {
      createdBy: { select: publicUserInformationSelect },
      invitees: { where: { userId: myId }, select: { rsvp: true } },
    },
  });
  return events;
}

export async function createNewEvent(
  eventData: CreateEventData & { createdById: UserId },
) {
  const events = await prisma.event.create({
    data: eventData,
  });
  return events;
}

export async function updateEventInfo(
  eventId: EventId,
  eventData: UpdateEventData,
  userId: UserId,
) {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    select: {
      createdById: true,
      imageUrl: true,
    },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  if (event.createdById !== userId) {
    throw new ForbiddenError("User is not authorized to update event");
  }

  const newEvent = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: eventData,
  });

  if (
    event.imageUrl &&
    eventData.imageUrl !== undefined &&
    event.imageUrl !== eventData.imageUrl
  ) {
    deleteImageFromS3(event.imageUrl).catch((error) =>
      console.error(`Failed to delete old image ${event.imageUrl}`, error),
    );
  }

  return newEvent;
}

export async function deleteEvent(eventId: EventId, userId: UserId) {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    select: {
      createdById: true,
      imageUrl: true,
    },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  if (event.createdById !== userId) {
    throw new ForbiddenError("User is not authorized to delete event");
  }

  await prisma.event.delete({
    where: {
      id: eventId,
    },
  });

  if (event.imageUrl) {
    await deleteImageFromS3(event.imageUrl).catch((error) =>
      console.error("Failed to delete event image from S3:", error),
    );
  }
}

export async function rsvpToEvent(
  userId: UserId,
  eventId: EventId,
  rsvpStatus: RsvpStatus,
  comment?: string,
) {
  const eventExists = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!eventExists) {
    throw new NotFoundError("Event not found, you cannot RSVP to it");
  }

  if (eventExists.endsAt && new Date(eventExists.endsAt) < new Date()) {
    throw new ValidationError("Event has ended, you cannot RSVP to it");
  }

  const inviteeExists = await prisma.invitee.findUnique({
    where: { eventId_userId: { eventId, userId } },
  });

  if (!inviteeExists) {
    throw new ForbiddenError(
      "You are not invited to this event, you cannot RSVP to it",
    );
  }

  return prisma.invitee.update({
    where: { eventId_userId: { eventId, userId } },
    data: {
      rsvp: rsvpStatus,
      rsvpComment: comment,
      updatedAt: new Date(),
    },
  });
}
