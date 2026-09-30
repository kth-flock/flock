import { z } from "zod";
import { idSchema } from "./common";

export const createEventSchema = z.object({
  createdById: idSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  locationName: z.string().optional(),
  googlePlaceId: z.string().optional(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().optional(),
  imageUrl: z.string().optional(),
});

export const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  locationName: z.string().optional(),
  googlePlaceId: z.string().optional(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
});
