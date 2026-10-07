import { z } from "zod";
import { idSchema } from "./common";
import { UserId } from "./user";

export type EventId = z.infer<typeof idSchema>;

export const createEventSchema = z
  .object({
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

export type CreateEventData = z.infer<typeof createEventSchema> & {
  createdById: UserId;
};

export const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  locationName: z.string().optional(),
  googlePlaceId: z.string().optional(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
});

export type UpdateEventData = z.infer<typeof updateEventSchema>;
