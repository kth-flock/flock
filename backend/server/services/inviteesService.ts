import { prisma } from "../prisma";
import { UserId } from "@flock/shared/schemas/user"; 
import { EventId } from "@flock/shared/schemas/event"; 

export class InviteeNotFoundError extends Error {}
export class EventNotFoundError extends Error {}
export class InviteeAlreadyInvitedError extends Error {}
export class NotAuthorizedError extends Error {}
export class InviteeCannotInviteSelfError extends Error {}
export class InviteeNotInvitedError extends Error {}
export async function addInvitee(userId: UserId, eventId: EventId, inviteeId: UserId) {

    const eventExists = await prisma.event.findUnique({
        where: { id: eventId },
    });
    
    if (!eventExists) {
        throw new EventNotFoundError();
    }

    if(eventExists.createdById !== userId) {
        throw new NotAuthorizedError();
    }
    const inviteeExists = await prisma.user.findUnique({
        where: { id: inviteeId },
    });
    if (!inviteeExists) {
        throw new InviteeNotFoundError();
    }
    
    if(inviteeId == userId) {
        throw new InviteeCannotInviteSelfError();
    }

    const inviteeAlreadyInvited = await prisma.invitee.findUnique({
        where: { eventId_userId: { eventId, userId: inviteeId } },
    });
    if (inviteeAlreadyInvited) {
        throw new InviteeAlreadyInvitedError();
    }


    const invitee = await prisma.invitee.create({
        data:{
            eventId,
            userId: inviteeId,
        },
    });
  
    return invitee;
  }

  export async function removeInvitee(userId: UserId, eventId: EventId, inviteeId: UserId) {
    const eventExists = await prisma.event.findUnique({
        where: { id: eventId },
    });
    
    if (!eventExists) {
        throw new EventNotFoundError();
    }

    if(eventExists.createdById !== userId) {
        throw new NotAuthorizedError();
    }
    const inviteeExists = await prisma.user.findUnique({
        where: { id: inviteeId },
    });
    if (!inviteeExists) {
        throw new InviteeNotFoundError();
    }
    const inviteeIsNotInvited = await prisma.invitee.findUnique({
        where: { eventId_userId: { eventId, userId: inviteeId } },
    });
    if (!inviteeIsNotInvited) {
        throw new InviteeNotInvitedError();
    }

    const invitee = await prisma.invitee.delete({
        where: { eventId_userId: { eventId, userId: inviteeId } },
    });
    return invitee;
  }