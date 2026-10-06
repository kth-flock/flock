import { imageFolderSchema, imageSchema } from "@flock/shared/schemas/common";
import { Request, Response } from "express";
import * as imageServices from "../services/imageService";

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ error: "No file provided" });
  }

  const folderResult = imageFolderSchema.safeParse(req.body?.folder);

  if (!folderResult.success) {
    return res.status(400).json({
      error: "Invalid folder",
      details: folderResult.error.issues,
    });
  }

  const fileResult = imageSchema.safeParse(req.file);

  if (!fileResult.success) {
    return res.status(400).json({
      error: "Invalid image",
      details: fileResult.error.issues,
    });
  }

  const imgKey = await imageServices.uploadImage(req.file, folderResult.data);

  res.status(201).json({ imgKey });
}
