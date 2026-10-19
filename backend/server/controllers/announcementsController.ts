import { Request, Response } from "express";
import * as announcementsService from "../services/announcementsService";
import { idSchema } from "@flock/shared/schemas/common";
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from "@flock/shared/schemas/announcement";
import { validate } from "../utils/validate";

export async function addAnnouncement(req: Request, res: Response) {
  const eventId = validate(idSchema, req.params.eventId, "Invalid event ID");
  const userId = validate(idSchema, req.user.id, "Invalid user ID");
  const announcementData = validate(
    createAnnouncementSchema,
    req.body,
    "Invalid announcement data",
  );

  const announcement = await announcementsService.addAnnouncement(
    eventId,
    userId,
    announcementData,
  );

  res.status(201).json({ status: "Success", data: announcement });
}

export async function updateAnnouncement(req: Request, res: Response) {
  const eventId = validate(idSchema, req.params.eventId, "Invalid event ID");
  const announcementId = validate(
    idSchema,
    req.params.announcementId,
    "Invalid announcement ID",
  );
  const userId = validate(idSchema, req.user.id, "Invalid user ID");
  const announcementData = validate(
    updateAnnouncementSchema,
    req.body,
    "Invalid announcement data",
  );

  const announcement = await announcementsService.updateAnnouncement(
    eventId,
    announcementId,
    userId,
    announcementData,
  );

  res.status(200).json({ status: "Success", data: announcement });
}

export async function deleteAnnouncement(req: Request, res: Response) {
  const eventId = validate(idSchema, req.params.eventId, "Invalid event ID");
  const announcementId = validate(
    idSchema,
    req.params.announcementId,
    "Invalid announcement ID",
  );
  const userId = validate(idSchema, req.user.id, "Invalid user ID");

  await announcementsService.deleteAnnouncement(
    eventId,
    announcementId,
    userId,
  );

  res.status(204).send();
}
