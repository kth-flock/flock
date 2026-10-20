import { z } from "zod";
import { idSchema } from "./common";

export type EventId = z.infer<typeof idSchema>;

export const createEventSchema = z
  .object({
    title: z.string({ error: "Title is required." }).min(1),
    description: z.string().optional(),
    locationName: z.string().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    startsAt: z.coerce
      .date({ error: "Start date and time are required." })
      .refine((date) => date.getTime() > Date.now(), {
        error: "Start date must be in the future.",
      }),
    endsAt: z.coerce
      .date({ error: "End date and time must be set together." })
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
      error: "End date and time must be after the start date.",
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
      .date({ error: "Start date and time are required." })
      .optional(),
    endsAt: z.coerce
      .date({ error: "End date and time must be set together." })
      .nullable()
      .optional(),
    imageUrl: z.string().nullable().optional(),
  })
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

type EventTimes = { startsAt: Date; endsAt: Date | null };

const sameMinute = (a: Date | null, b: Date | null) =>
  a?.getTime() === b?.getTime() ||
  (!!a && !!b && Math.floor(a.getTime() / 60000) === Math.floor(b.getTime() / 60000));

export function eventTimeErrors(
  update: Pick<UpdateEventData, "startsAt" | "endsAt">,
  current: EventTimes,
) {
  const errors: { path: "startsAt" | "endsAt"; message: string }[] = [];
  const now = Date.now();
  const startsAt = update.startsAt ?? current.startsAt;
  const endsAt = update.endsAt === undefined ? current.endsAt : update.endsAt;

  const hasBegun = current.startsAt.getTime() <= now;

  if (hasBegun && !sameMinute(startsAt, current.startsAt)) {
    errors.push({
      path: "startsAt",
      message: "The start can't be changed after the event has begun.",
    });
  } else if (
    !sameMinute(startsAt, current.startsAt) &&
    startsAt.getTime() <= now
  ) {
    errors.push({
      path: "startsAt",
      message: "Start date must be in the future.",
    });
  }
  if (hasBegun && current.endsAt && !endsAt) {
    errors.push({
      path: "endsAt",
      message: "The end date can't be removed after the event has begun.",
    });
  }
  if (
    endsAt &&
    !sameMinute(endsAt, current.endsAt) &&
    endsAt.getTime() <= now
  ) {
    errors.push({ path: "endsAt", message: "End date must be in the future." });
  }
  if (endsAt && endsAt.getTime() <= startsAt.getTime()) {
    errors.push({
      path: "endsAt",
      message: "End date must be after the start date.",
    });
  }
  return errors;
}

export const updateEventSchemaFor = (current: EventTimes) =>
  updateEventSchema.superRefine((update, ctx) => {
    for (const { path, message } of eventTimeErrors(update, current)) {
      ctx.addIssue({ code: "custom", path: [path], message });
    }
  });

export type RsvpStatus = "PENDING" | "ACCEPTED" | "MAYBE" | "DECLINED";

export const rsvpStatusSchema = z.enum([
  "PENDING",
  "ACCEPTED",
  "MAYBE",
  "DECLINED",
]);

export const rsvpToEventSchema = z.object({
  rsvp: rsvpStatusSchema,
  rsvpComment: z
    .string()
    .max(200, "Comment can be at most 200 characters")
    .nullable()
    .optional(),
});
export type RsvpToEventData = z.infer<typeof rsvpToEventSchema>;
