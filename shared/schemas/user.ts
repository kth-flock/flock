import { z } from "zod";
import { idSchema } from "./common";

export const createUserSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.email(),
  imgUrl: z.string().optional(),
  password: z.string().optional(),
});

export const editUserSchema = createUserSchema
  .omit({ email: true, password: true })
  .partial();
