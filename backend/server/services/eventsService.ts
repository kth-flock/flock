import { prisma } from "../prisma";
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
import {
  withSignedImageUrl,
  withSignedEventUserImages,
  deleteImageFromS3,
} from "./imageService";

export async function getEvents() {
  const events = await prisma.event.findMany();

  return Promise.all(events.map((event) => withSignedImageUrl(event)));
}

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

  const eventWithImage = await withSignedEventUserImages(event);

  if (isHost) {
    return eventWithImage;
  }

  //If not host return data without rsvpComments
  return {
    ...eventWithImage,
    invitees: eventWithImage.invitees.map(
      ({ rsvpComment, ...invitee }) => invitee,
    ),
  };
}

export async function getCreatedEvents(userId: UserId) {
  const events = await prisma.event.findMany({
    where: { createdById: userId },
  });
  return Promise.all(events.map((event) => withSignedImageUrl(event)));
}

export async function getInvitedEvents(userId: UserId) {
  const events = await prisma.event.findMany({
    where: {
      invitees: {
        some: {
          userId: userId,
        },
      },
    },

    include: {
      createdBy: {
        select: publicUserInformationSelect,
      },
    },
  });
  return Promise.all(events.map((event) => withSignedImageUrl(event)));
}

export async function createNewEvent(
  eventData: CreateEventData & { createdById: UserId },
) {
  const events = await prisma.event.create({
    data: eventData,
  });
  return event;
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

  // Replaced image is no longer referenced, so remove it and a failed delete shouldn't fail the update.
  if (
    event.imageUrl &&
    eventData.imageUrl &&
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
    },
  });

  //TODO: Should we return weather the event exists if they are not authorized to change it????
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
    throw new ValidationError(
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
