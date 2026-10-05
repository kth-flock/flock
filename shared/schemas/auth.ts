import { z } from "zod";


export type RegisterUser = z.infer<typeof registerUserSchema>;

export const registerUserSchema = z
  .object({
    firstName: z.string().trim().min(1, "Must be at least 1 character"),
    lastName: z.string().trim().min(1, "Must be at least 1 character"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Must be at least 1 character"), //TODO: for now its not optional but in future we may add google login.
  })
  .strict();

  export type LoginUser = z.infer<typeof loginUserSchema>;
 
  export const loginUserSchema = registerUserSchema.pick({ email: true, password: true });