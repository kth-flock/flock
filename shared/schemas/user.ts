import { z } from "zod";
import { idSchema } from "./common";

export type UserId = z.infer<typeof idSchema>;
export type UserInfo = z.infer<typeof editUserInfoSchema>;

export const createUserSchema = z
  .object({
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    email: z.email(),
    imageUrl: z.string().optional().nullable(),
    password: z.string().optional(),
  })
  .strict();

export const editUserInfoSchema = createUserSchema
  .omit({ email: true, password: true })
  .partial()
  .strict();
