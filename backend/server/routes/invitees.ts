import { Router } from "express";

export const inviteesRouter = Router({ mergeParams: true });
import { authMiddleware } from "../middleware/authMiddleware";
import {
  addInviteesInBatch,
  addInvitee,
  removeInvitee,
} from "../controllers/inviteesController";

inviteesRouter.post("/", authMiddleware, addInviteesInBatch);
inviteesRouter.post("/:inviteeId", authMiddleware, addInvitee); // TODO: invitees or invite?
inviteesRouter.delete("/:inviteeId", authMiddleware, removeInvitee);
