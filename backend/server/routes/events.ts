import { Router } from "express";
import {
  getEvents,
  getEventById,
  getEventsCreatedBy,
  getInvitedEventsFor,
  createNewEvent,
  updateEventInfo,
  deleteEvent,
} from "../controllers/eventsController";

export const eventsRouter = Router();

//Get surface level data for all events (no annoncements, comments, or userData)
eventsRouter.get("/", getEvents);

//Get full information for a specific event. Includes all annoncements, comments
//and userData for user that created the event, annoncement or comment
eventsRouter.get("/:eventId", getEventById);

//Get surface level data for all events created by user (no annoncements, comments, or userData)
eventsRouter.get("/createdBy/:userId", getEventsCreatedBy);

//Get surface level data for all events a user is invited to (no annoncements or comments)
//Also includes userdata for user that created the event.
eventsRouter.get("/invited/:userId", getInvitedEventsFor);

//Post a new event
eventsRouter.post("/", createNewEvent);

//Patch an event with eventId
eventsRouter.patch("/:eventId", updateEventInfo);

//Delte event by eventId
eventsRouter.delete("/:eventId", deleteEvent);
