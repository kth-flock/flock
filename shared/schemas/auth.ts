import { z } from "zod";

export type RegisterUser = z.infer<typeof registerUserSchema>;

export const registerUserSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name cannot be empty"),
    lastName: z.string().trim().min(1, "Last name cannot be empty"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Must be at least 8 characters")
      .max(50, "Must be at most 50 characters"),
  })
  .strict();

export type LoginUser = z.infer<typeof loginUserSchema>;

export const loginUserSchema = registerUserSchema.pick({
  email: true,
  password: true,
});
