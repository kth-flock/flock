import { z } from "zod";
import { idSchema } from "./common";
import { emailSchema, passwordSchema } from "./auth";

export type UserId = z.infer<typeof idSchema>;
export type UserInfo = z.infer<typeof editUserInfoSchema>;
export type FriendshipStatus =
  | "NONE"
  | "FRIENDS"
  | "REQUEST_SENT"
  | "REQUEST_RECEIVED";

export const createUserSchema = z
  .object({
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    email: emailSchema,
    imageUrl: z.string().optional().nullable(),
    password: z.string().optional(),
  })
  .strict();

export const editUserInfoSchema = createUserSchema
  .omit({ email: true, password: true })
  .partial()
  .strict();

export const changeEmailSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
  })
  .strict();

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
  })
  .strict();

export type ChangeEmail = z.infer<typeof changeEmailSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;

export const searchUsersQuerySchema = z.object({
  query: z.string().trim().max(50).optional(),
});
