import { prisma } from "../prisma";
import { UserId } from "@flock/shared/schemas/user";
import { EventId } from "@flock/shared/schemas/event";
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
  ConflictError,
} from "../utils/errors";

async function assertEventHost(
  userId: UserId,
  eventId: EventId,
  forbiddenMessage: string,
) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new NotFoundError("Event not found");
  if (event.createdById !== userId) throw new ForbiddenError(forbiddenMessage);
}

async function assertUserExists(inviteeId: UserId) {
  const user = await prisma.user.findUnique({ where: { id: inviteeId } });
  if (!user) throw new NotFoundError("Invitee is not a valid user");
}

export async function addInvitee(
  userId: UserId,
  eventId: EventId,
  inviteeId: UserId,
) {
  await assertEventHost(userId, eventId, "Only event host can invite users");

  await assertUserExists(inviteeId);

  if (inviteeId === userId) {
    throw new ValidationError("You cannot invite yourself to your own event");
  }

  const inviteeAlreadyInvited = await prisma.invitee.findUnique({
    where: { eventId_userId: { eventId, userId: inviteeId } },
  });
  if (inviteeAlreadyInvited) {
    throw new ConflictError("User already invited to event");
  }

  return prisma.invitee.create({
    data: {
      eventId,
      userId: inviteeId,
    },
  });
}

export async function AddInviteesInBatch(
  userId: UserId,
  eventId: EventId,
  inviteeIds: UserId[],
) {
  await assertEventHost(userId, eventId, "Only event host can invite users");

  const uniqueIds = [...new Set(inviteeIds)].filter((id) => id !== userId);

  const existingCount = await prisma.user.count({
    where: { id: { in: uniqueIds } },
  });

  const invitees = await prisma.invitee.createMany({
    data: uniqueIds.map((userId) => ({ userId, eventId })),
    skipDuplicates: true,
  });

  return { invitees, skipped: uniqueIds.length - existingCount };
}

export async function removeInvitee(
  userId: UserId,
  eventId: EventId,
  inviteeId: UserId,
) {
  await assertEventHost(
    userId,
    eventId,
    "Only event host can remove invitees",
  );

  await assertUserExists(inviteeId);

  const inviteeIsInvited = await prisma.invitee.findUnique({
    where: { eventId_userId: { eventId, userId: inviteeId } },
  });
  if (!inviteeIsInvited) {
    throw new NotFoundError("Invitee is not invited to the event");
  }

  return prisma.invitee.delete({
    where: { eventId_userId: { eventId, userId: inviteeId } },
  });
}
