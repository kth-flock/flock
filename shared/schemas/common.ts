import { z } from "zod";

export type Direction = z.infer<typeof directionSchema>;

export const idSchema = z.coerce.number().int().positive();
export const directionSchema = z.enum(["sent", "received"]).optional();

export const ALLOWED_IMG_TYPES = ["image/jpeg", "image/png"];
export const MAX_IMG_SIZE = 5 * 1024 * 1024;

export const imageSchema = z.object({
  mimetype: z.enum(ALLOWED_IMG_TYPES),
  size: z.number().max(MAX_IMG_SIZE),
});

export const imageFolderSchema = z.enum(["events", "profiles"]);
export type ImageFolder = z.infer<typeof imageFolderSchema>;
