import { z } from "zod";

export const idSchema = z.coerce.number().int().positive();

export const directionSchema = z.enum(["sent", "received"]).optional();
export type Direction = z.infer<typeof directionSchema>;
