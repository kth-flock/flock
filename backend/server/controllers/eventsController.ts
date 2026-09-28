import { Request, Response } from "express";
import * as eventsService from "../services/eventsService";
import { idSchema } from "@flock/shared/schemas/common";
import {
  createEventSchema,
  updateEventSchema,
} from "@flock/shared/schemas/event";
import { getUserById } from "../services/usersServices";

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
