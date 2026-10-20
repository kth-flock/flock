import { Router } from "express";

export const inviteesRouter = Router({ mergeParams: true });
import {
  addInviteesInBatch,
  addInvitee,
  removeInvitee,
} from "../controllers/inviteesController";

inviteesRouter.post("/", addInviteesInBatch);
inviteesRouter.post("/:inviteeId", addInvitee);
inviteesRouter.delete("/:inviteeId", removeInvitee);
