import { Router } from "express";
import { commentsRouter } from "./comments";
import {
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementsController";

export const announcementsRouter = Router({ mergeParams: true });

announcementsRouter.use("/:announcementId/comments", commentsRouter);

announcementsRouter.post("/", addAnnouncement);
announcementsRouter.patch("/:announcementId", updateAnnouncement);
announcementsRouter.delete("/:announcementId", deleteAnnouncement);
