import { z } from "zod";
import { idSchema } from "./common";

export type AddInvitee = z.infer<typeof addInviteeSchema>;

//TODO: remove the eventId from the schema, it is already in the url

export const addInviteeSchema = z
  .object({
    eventId: idSchema,
    inviteeId: idSchema,
  })
  .strict();
