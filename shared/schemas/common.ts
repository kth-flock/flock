import { z } from "zod";

export type Direction = z.infer<typeof directionSchema>;

export const idSchema = z.coerce.number().int().positive();
export const directionSchema = z.enum(["sent", "received"]).optional();
