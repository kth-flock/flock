import { RegisterUser, registerUserSchema } from "@flock/shared/schemas/auth";
import { z } from "zod";

export type RegisterUserDraft = RegisterUser & {
  confirmPassword: string;
  profilePicture: File | null;
};

export const registerUserFormSchema = registerUserSchema
  .extend({
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
