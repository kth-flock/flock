import { Router } from "express";
import { getNotifications } from "../controllers/notificationsController";

export const notificationsRouter = Router();

// GET my notifications, newest first
notificationsRouter.get("/", getNotifications);
