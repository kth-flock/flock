import { Router } from "express";
import {
  getEvents,
  getEventById,
  getCreatedEvents,
  getInvitedEvents,
  createNewEvent,
  updateEventInfo,
  deleteEvent,
  rsvpToEvent,
} from "../controllers/eventsController";
import { authMiddleware } from "../middleware/authMiddleware";
import { inviteesRouter } from "./invitees";
import { announcementsRouter } from "./announcement";

export const eventsRouter = Router();

eventsRouter.use("/:eventId/invitees", inviteesRouter);
eventsRouter.use("/:eventId/announcements", announcementsRouter);

//Get surface level data for all events (no annoncements, comments, or userData)
eventsRouter.get("/", getEvents);

//Get surface level data for all events created by user (no annoncements, comments, or userData)
eventsRouter.get("/created", getCreatedEvents);

//Get surface level data for all events a user is invited to (no annoncements or comments)
//Also includes userdata for user that created the event.
eventsRouter.get("/invited", getInvitedEvents);

//Get full information for a specific event. Includes all annoncements, comments and userData for user that created the event, annoncement or comment
eventsRouter.get("/:eventId", getEventById);

//Post a new event
eventsRouter.post("/", createNewEvent);

//Patch an event with eventId
eventsRouter.patch("/:eventId", updateEventInfo);

//Delete event by eventId
eventsRouter.delete("/:eventId", deleteEvent);

//RSVP to an event only if current logged in user is invited to the event
eventsRouter.patch("/:eventId/rsvp", authMiddleware, rsvpToEvent); // TODO: middleware (might be applied to the entire event router but ill put it here for now //Elinor)
