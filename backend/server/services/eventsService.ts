import { prisma } from "../prisma";
import { publicUserInformationSelect } from "../utils/selectors";
import {
  CreateEventData,
  EventId,
  UpdateEventData,
} from "@flock/shared/schemas/event";
import { UserId } from "@flock/shared/schemas/user";

export async function getEvents() {
  const events = await prisma.event.findMany();
  return events;
}

export async function getEventById(eventId: EventId) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },

    include: {
      createdBy: {
        select: publicUserInformationSelect,
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
  return event;
}

export async function getEventsCreatedBy(userId: UserId) {
  const events = await prisma.event.findMany({
    where: { createdById: userId },
  });
  return events;
}

export async function getInvitedEventsFor(userId: UserId) {
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
) {
  const events = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: eventData,
  });
  return events;
}

export async function deleteEvent(eventId: EventId) {
  await prisma.event.delete({
    where: {
      id: eventId,
    },
  });
}
