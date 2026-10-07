import { Router } from "express";

export const inviteesRouter = Router({ mergeParams: true });
import { authMiddleware } from "../middleware/authMiddleware";
import { addInvitee, removeInvitee } from "../controllers/inviteesController";


inviteesRouter.post("/invite", authMiddleware, addInvitee); // TODO: invitees or invite?
inviteesRouter.delete("/invitees", authMiddleware, removeInvitee);
