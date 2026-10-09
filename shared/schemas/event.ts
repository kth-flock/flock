import { z } from "zod";
import { idSchema } from "./common";

export type EventId = z.infer<typeof idSchema>;

export const createEventSchema = z
  .object({
    createdById: idSchema,
    title: z.string({ error: "Title is required." }).min(1),
    description: z.string().optional(),
    locationName: z.string().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    startsAt: z.coerce
      .date({ error: "Start date is required." })
      .refine((date) => date.getTime() > Date.now(), {
        error: "Start date must be in the future.",
      }),
    endsAt: z.coerce
      .date({ error: "End date must be valid." })
      .refine((date) => date.getTime() > Date.now(), {
        error: "End date must be in the future.",
      })
      .optional(),
    imageUrl: z.string().optional(),
  })
  .refine(
    (event) =>
      !event.endsAt || event.endsAt.getTime() > event.startsAt.getTime(),
    {
      path: ["endsAt"],
      error: "End date must be after the start date.",
    },
  )
  .refine(
    (event) =>
      (event.latitude === undefined) === (event.longitude === undefined),
    {
      path: ["latitude"],
      error: "Latitude and longitude must be provided together.",
    },
  );

export type CreateEventData = z.infer<typeof createEventSchema>;

export const updateEventSchema = z
  .object({
    title: z.string({ error: "Title is required." }).min(1).optional(),
    description: z.string().nullable().optional(),
    locationName: z.string().nullable().optional(),
    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional(),
    startsAt: z.coerce
      .date()
      .refine((date) => date.getTime() > Date.now(), {
        error: "Start date must be in the future.",
      })
      .optional(),
    endsAt: z
      .coerce
      .date()
      .nullable()
      .optional()
      .refine((date) => date == null || date.getTime() > Date.now(), {
        error: "End date must be in the future.",
      }),
    imageUrl: z.string().nullable().optional(),
  })
  .refine(
    (event) =>
      !event.startsAt ||
      !(event.endsAt instanceof Date) ||
      event.endsAt.getTime() > event.startsAt.getTime(),
    {
      path: ["endsAt"],
      error: "End date must be after the start date.",
    },
  )
  .refine(
    (event) =>
      (event.latitude === undefined && event.longitude === undefined) ||
      (event.latitude === null && event.longitude === null) ||
      (typeof event.latitude === "number" &&
        typeof event.longitude === "number"),
    {
      path: ["latitude"],
      error: "Latitude and longitude must be provided together.",
    },
  );

export type UpdateEventData = z.infer<typeof updateEventSchema>;
