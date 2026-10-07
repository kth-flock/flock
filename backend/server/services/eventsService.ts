import { prisma } from "../prisma";
import { publicUserInformationSelect } from "../utils/selectors";
import {
  CreateEventData,
  EventId,
  UpdateEventData,
  RsvpStatus,
} from "@flock/shared/schemas/event";
import { UserId } from "@flock/shared/schemas/user";
import { EventNotFoundError } from "./inviteesService";

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

export class EventEndedError extends Error {}
export class InviteeNotInvitedError extends Error {}

export async function rsvpToEvent(userId: UserId, eventId: EventId, rsvpStatus: RsvpStatus, comment?: string) {
  const eventExists = await prisma.event.findUnique({
      where: { id: eventId },
  });

  if (!eventExists) {
      throw new EventNotFoundError();
  }
  if (eventExists.endsAt && new Date(eventExists.endsAt) < new Date()) {
    throw new EventEndedError();
  }
  const inviteeExists = await prisma.invitee.findUnique({
    where: { eventId_userId: { eventId, userId: userId } },
  });
  if (!inviteeExists) {
    throw new InviteeNotInvitedError();
  }

  const rsvp = await prisma.invitee.update({
    where: { eventId_userId: { eventId, userId: userId } },
    data: {
      rsvp: rsvpStatus,
      rsvpComment: comment,
    },
  });
  return rsvp;
}

