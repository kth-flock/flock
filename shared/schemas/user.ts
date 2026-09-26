import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  imgageUrl: z.string().optional(),
  password: z.string().optional(),
});

export const editUserSchema = createUserSchema
  .omit({ email: true, password: true })
  .partial();
