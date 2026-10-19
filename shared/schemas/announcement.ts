import { z } from "zod";
import { idSchema } from "./common";

export type AnnouncementId = z.infer<typeof idSchema>;
const MAX_ANNOUNCEMENT_LENGTH = 1000;

export const createAnnouncementSchema = z
  .object({
    content: z
      .string({ error: "Content is required." })
      .trim()
      .min(1, "Announcement cannot be empty")
      .max(
        MAX_ANNOUNCEMENT_LENGTH,
        "Announcement must be at most ${MAX_ANNOUNCEMENT_LENGTH} characters",
      ),
  })
  .strict();

export const updateAnnouncementSchema = createAnnouncementSchema;

export type CreateAnnouncementData = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncementData = z.infer<typeof updateAnnouncementSchema>;
