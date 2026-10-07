import { z } from "zod";
import { idSchema } from "./common";

export type AddInvitee = z.infer<typeof addInviteeSchema>;

export const addInviteeSchema = z
  .object({
    eventId: idSchema,
    inviteeId: idSchema,
  })
  .strict();
