import { z } from "zod";

const emailSchema = z.string().email("Invalid email address");

export const registerUserSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name cannot be empty"),
    lastName: z.string().trim().min(1, "Last name cannot be empty"),
    email: emailSchema,
    // TODO: for now its not optional but in future we may add google login.
    password: z
      .string()
      .min(8, "Must be at least 8 characters")
      .max(50, "Must be at most 50 characters")
      .regex(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
        message:
          "Should contain at least one uppercase letter and one number.",
      }),
  })
  .strict();

export type RegisterUser = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
  })
  .strict();

export type LoginUser = z.infer<typeof loginUserSchema>;
