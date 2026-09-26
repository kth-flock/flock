import { z } from "zod";
import { idSchema } from "./common";

export const createFriendshipSchema = z.object({
  userId: idSchema,
});
