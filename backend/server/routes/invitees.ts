import { Router } from "express";

export const inviteesRouter = Router();
import { authMiddleware } from "../middleware/authMiddleware";
import { addInvitee, removeInvitee } from "../controllers/inviteesController";


//TODO add auth middleware, bc u must be logged in to change add your own invitees to your events
inviteesRouter.post("/invite", authMiddleware, addInvitee); // TODO: invitees or invite?
inviteesRouter.delete("/invitees", authMiddleware, removeInvitee);
