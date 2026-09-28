import { Router } from "express";
import { prisma } from "../prisma";
import {
  createEventSchema,
  updateEventSchema,
} from "@flock/shared/schemas/event";
import { idSchema } from "@flock/shared/schemas/common";

//TODO: refractor repetative code? Also to better layer arcitecture?

export const eventsRouter = Router();

//TODO: Usefull more places refactor?
const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  imageUrl: true,
};

//Get surface level data for all events (no annoncements, comments, or userData)
eventsRouter.get("/", async (req, res) => {
  const events = await prisma.event.findMany();
  res.json(events);
});

//Get full information for a specific event. Includes all annoncements, comments
//and userData for user that created the event, annoncement or comment
eventsRouter.get("/:eventId", async (req, res) => {
  const result = idSchema.safeParse(req.params.eventId);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid event ID",
    });
  }

  const eventId = result.data;

  const event = await prisma.event.findUnique({
    where: { id: eventId },

    include: {
      createdBy: {
        select: userSelect,
      },

      announcements: {
        include: {
          user: {
            select: userSelect,
          },

          comments: {
            include: {
              user: {
                select: userSelect,
              },
            },
          },
        },
      },
    },
  });

  if (!event) {
    return res.status(404).json({
      error: "Event not found",
    });
  }

  res.json(event);
});

//Get surface level data for all events created by user (no annoncements, comments, or userData)
eventsRouter.get("/createdBy/:userId", async (req, res) => {
  const result = idSchema.safeParse(req.params.userId);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }

  const userId = result.data;
  const events = await prisma.event.findMany({
    where: { createdById: userId },
  });
  res.json(events);
});

//Get surface level data for all events a user is invited to (no annoncements or comments)
//Also includes userdata for user that created the event.
eventsRouter.get("/invited/:userId", async (req, res) => {
  try {
    const result = idSchema.safeParse(req.params.userId);

    if (!result.success) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    const userId = result.data;

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
          select: userSelect,
        },
      },
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message,
    });
  }
});

//Post a new event
eventsRouter.post("/", async (req, res) => {
  const result = createEventSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid event data",
      details: result.error.issues,
    });
  }

  const event = await prisma.event.create({
    data: result.data,
  });
  res.status(201).json(event);
});

//Patch an event with eventId
eventsRouter.patch("/:eventId", async (req, res) => {
  const idResult = idSchema.safeParse(req.params.eventId);

  if (!idResult.success) {
    return res.status(400).json({
      error: "Invalid event ID",
    });
  }

  const eventId = idResult.data;

  const bodyResult = updateEventSchema.safeParse(req.body);

  if (!bodyResult.success) {
    return res.status(400).json({
      error: "Invalid event data",
      details: bodyResult.error.issues,
    });
  }

  const eventData = bodyResult.data;

  const event = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: eventData,
  });

  res.json(event);
});

//Delte event by eventId
eventsRouter.delete("/:eventId", async (req, res) => {
  const result = idSchema.safeParse(req.params.eventId);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid event ID",
    });
  }

  const eventId = result.data;

  await prisma.event.delete({
    where: {
      id: eventId,
    },
  });

  res.status(204).send();
});
