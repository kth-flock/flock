import { Request, Response } from "express";
import * as eventsService from "../services/eventsService";
import { idSchema } from "@flock/shared/schemas/common";
import {
  createEventSchema,
  updateEventSchema,
  rsvpStatusSchema,
  rsvpToEventSchema,
} from "@flock/shared/schemas/event";
import { getUserById } from "../services/usersServices";
import { validate } from "../utils/validate";
import { NotFoundError } from "../utils/errors";
import { EventNotFoundError } from "../services/inviteesService";

export async function getEvents(req: Request, res: Response) {
  const events = await eventsService.getEvents();
  res.status(200).json(events);
}

export async function getEventById(req: Request, res: Response) {
  const eventId = validate(idSchema, req.params.eventId, "Invalid event ID");
  const userId = validate(idSchema, req.user.id, "Invalid user ID");

  const event = await eventsService.getEventById(eventId, userId);

  res.status(200).json(event);
}

export async function getCreatedEvents(req: Request, res: Response) {
  const userId = validate(idSchema, req.user.id, "Invalid user ID");

  const user = await getUserById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const events = await eventsService.getCreatedEvents(userId);
  res.status(200).json(events);
}

export async function getInvitedEvents(req: Request, res: Response) {
  const userId = validate(idSchema, req.user.id, "Invalid user ID");

  const user = await getUserById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const events = await eventsService.getInvitedEvents(userId);

  res.status(200).json(events);
}

export async function createNewEvent(req: Request, res: Response) {
  const eventData = validate(createEventSchema, req.body, "Invalid event data");
  const userId = validate(idSchema, req.user.id, "Invalid user ID");

  const createEventData = {
    createdById: userId,
    ...eventData,
  };

  const event = await eventsService.createNewEvent(createEventData);
  res.status(201).json(event);
}

export async function updateEventInfo(req: Request, res: Response) {
  const eventId = validate(idSchema, req.params.eventId, "Invalid event ID");
  const eventData = validate(updateEventSchema, req.body, "Invalid event data");
  const userId = validate(idSchema, req.user.id, "Invalid user ID");

  const updatedEvent = await eventsService.updateEventInfo(
    eventId,
    eventData,
    userId,
  );

  res.status(200).json(updatedEvent);
}

export async function deleteEvent(req: Request, res: Response) {
  const eventId = validate(idSchema, req.params.eventId, "Invalid event ID");
  const userId = validate(idSchema, req.user.id, "Invalid user ID");

  await eventsService.deleteEvent(eventId, userId);

  res.status(204).send();
}

export async function rsvpToEvent(req: Request, res: Response) {

  try{
  const eventId = req.params.eventId;
  const eventIdResult = idSchema.safeParse(eventId); 
  if (!eventIdResult.success) {
      return res.status(400).json({
          error: "Invalid event ID",
      });
  }
  
  const rsvpData = rsvpToEventSchema.safeParse(req.body);
  if (!rsvpData.success) {
    return res.status(400).json({
      error: "Invalid rsvp data",
    });
  }

  const rsvp = await eventsService.rsvpToEvent(req.user.id, eventIdResult.data, rsvpData.data.rsvp, rsvpData.data.rsvpComment);
  res.status(200).json({ status: "Success", data: rsvp });
}
catch (error) {
  if (error instanceof EventNotFoundError) {
    return res.status(404).json({
      error: "Event not found, you cannot RSVP to it",
    });
  }
  if (error instanceof eventsService.InviteeNotInvitedError) {
    return res.status(400).json({
      error: "You are not invited to this event, you cannot RSVP to it",
    });
  }
  if (error instanceof eventsService.EventEndedError) {
    return res.status(400).json({
      error: "Event has ended, you cannot RSVP to it",
    });
  }
  throw error;
}

}