import { Router } from "express";

export const inviteesRouter = Router({ mergeParams: true });
import {
  addInviteesInBatch,
  addInvitee,
  removeInvitee,
} from "../controllers/inviteesController";

inviteesRouter.post("/", addInviteesInBatch);
inviteesRouter.post("/:inviteeId", addInvitee); // TODO: invitees or invite?
inviteesRouter.delete("/:inviteeId", removeInvitee);
