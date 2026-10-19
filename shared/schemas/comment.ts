import { z } from "zod";
import { idSchema } from "./common";

export type CommentId = z.infer<typeof idSchema>;
const MAX_COMMENT_LENGTH = 1000;

export const createCommentSchema = z
  .object({
    content: z
      .string({ error: "Content is required." })
      .trim()
      .min(1, "Comment cannot be empty")
      .max(
        MAX_COMMENT_LENGTH,
        "Comment must be at most ${MAX_COMMENT_LENGTH} characters",
      ),
  })
  .strict();

export const updateCommentSchema = createCommentSchema;

export type CreateCommentData = z.infer<typeof createCommentSchema>;
export type UpdateCommentData = z.infer<typeof updateCommentSchema>;
