import { z } from "zod";

export const searchLocationsSchema = z.object({
  q: z.string().trim().min(3, "Query must be at least 3 characters"),
});

export const reverseGeocodeSchema = z.object({
  lat: z
    .string()
    .trim()
    .min(1)
    .transform(Number)
    .pipe(z.number().min(-90).max(90)),
  lon: z
    .string()
    .trim()
    .min(1)
    .transform(Number)
    .pipe(z.number().min(-180).max(180)),
});

export type Location = {
  lat?: number;
  lon?: number;
  label: string;
};
