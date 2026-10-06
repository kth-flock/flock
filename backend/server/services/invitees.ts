import { prisma } from "../prisma";
import { UserId } from "@flock/shared/schemas/user"; 
import { EventId } from "@flock/shared/schemas/event"; 

export class InviteeNotFoundError extends Error {}
export class EventNotFoundError extends Error {}
export class InviteeAlreadyInvitedError extends Error {}

export async function addInvitee(userId: UserId, eventId: EventId) {
    const inviteeExists = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!inviteeExists) {
        throw new InviteeNotFoundError();
    }

    const eventExists = await prisma.event.findUnique({
        where: { id: eventId },
    });
    if (!eventExists) {
        throw new EventNotFoundError();
    }

    const inviteeAlreadyInvited = await prisma.invitee.findUnique({
        where: { eventId_userId: { eventId, userId } },
    });
    if (inviteeAlreadyInvited) {
        throw new InviteeAlreadyInvitedError();
    }

    const invitee = await prisma.invitee.create({
        data:{
            eventId,
            userId,
        },
    });
  
    return invitee;
  }