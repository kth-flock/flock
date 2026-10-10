import { Request, Response } from "express";
import * as notificationsService from "../services/notificationsService";

export async function getNotifications(req: Request, res: Response) {
  const notifications = await notificationsService.getNotifications(
    req.user.id,
  );

  res.status(200).json({ status: "Success", data: notifications });
}
