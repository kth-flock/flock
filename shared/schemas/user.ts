import { z } from "zod";
import { idSchema } from "./common";

export const createUserSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.email(),
  img_url: z.string().optional(),
  password: z.string().optional(),
});
