import { prisma } from "../prisma";
import { publicUserInformationSelect } from "../utils/selectors";
import {
  CreateEventData,
  EventId,
  UpdateEventData,
} from "@flock/shared/schemas/event";
import { NotFoundError, ForbiddenError } from "../utils/errors";
import { UserId } from "@flock/shared/schemas/user";

export async function getEvents() {
  const events = await prisma.event.findMany();
  return events;
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

  if (isHost) {
    return event;
  }

  //If not host return data without rsvpComments
  return {
    ...event,
    invitees: event.invitees.map(({ rsvpComment, ...invitee }) => invitee),
  };
}

export async function getCreatedEvents(userId: UserId) {
  const events = await prisma.event.findMany({
    where: { createdById: userId },
  });
  return events;
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
  return events;
}

export async function createNewEvent(eventData: CreateEventData) {
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
