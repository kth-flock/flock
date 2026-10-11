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
import { EventNotFoundError } from "../services/inviteesService";

export async function getEvents(req: Request, res: Response) {
  const events = await eventsService.getEvents();
  res.status(200).json(events);
}

export async function getEventById(req: Request, res: Response) {
  const result = idSchema.safeParse(req.params.eventId);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid event ID",
    });
  }

  const eventId = result.data;

  const event = await eventsService.getEventById(eventId);

  if (!event) {
    return res.status(404).json({
      error: "Event not found",
    });
  }

  res.status(200).json(event);
}

export async function getEventsCreatedBy(req: Request, res: Response) {
  const result = idSchema.safeParse(req.params.userId);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }

  const userId = result.data;

  const user = await getUserById(userId);

  if (!user) {
    return res.status(404).json({ status: "Error", error: "User not found" });
  }

  const events = await eventsService.getEventsCreatedBy(userId);
  res.status(200).json(events);
}

export async function getInvitedEventsFor(req: Request, res: Response) {
  const result = idSchema.safeParse(req.params.userId);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }

  const userId = result.data;

  const user = await getUserById(userId);

  if (!user) {
    return res.status(404).json({ status: "Error", error: "User not found" });
  }

  const events = await eventsService.getInvitedEventsFor(userId);

  res.status(200).json(events);
}

export async function createNewEvent(req: Request, res: Response) {
  // TODO: Connect user ID in backend to the valid session
  const result = createEventSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid event data",
      details: result.error.issues,
    });
  }

  const eventData = result.data;

  const event = await eventsService.createNewEvent(eventData);
  res.status(201).json(event);
}

export async function updateEventInfo(req: Request, res: Response) {
  const idResult = idSchema.safeParse(req.params.eventId);

  if (!idResult.success) {
    return res.status(400).json({
      error: "Invalid event ID",
    });
  }

  const eventId = idResult.data;

  const event = await eventsService.getEventById(eventId);

  if (!event) {
    return res.status(404).json({
      error: "Event not found",
    });
  }

  const bodyResult = updateEventSchema.safeParse(req.body);

  if (!bodyResult.success) {
    return res.status(400).json({
      error: "Invalid event data",
      details: bodyResult.error.issues,
    });
  }

  const eventData = bodyResult.data;

  const updatedEvent = await eventsService.updateEventInfo(eventId, eventData);

  res.status(200).json(updatedEvent);
}

export async function deleteEvent(req: Request, res: Response) {
  const result = idSchema.safeParse(req.params.eventId);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid event ID",
    });
  }

  const eventId = result.data;

  const event = await eventsService.getEventById(eventId);

  if (!event) {
    return res.status(404).json({
      error: "Event not found",
    });
  }

  await eventsService.deleteEvent(eventId);

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