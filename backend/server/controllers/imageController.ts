import {
  imageFolderSchema,
  imageKeySchema,
  imageSchema,
} from "@flock/shared/schemas/common";
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

  const imageURL = await imageServices.uploadImage(req.file, folderResult.data);

  res.status(201).json({ imageURL });
}

export async function deleteImageFromS3(req: Request, res: Response) {
  const imageURL = imageKeySchema.safeParse(req.body?.imageURL);

  if (!imageURL.success) {
    return res.status(400).json({
      error: "Invalid key",
    });
  }

  await imageServices.deleteImageFromS3(imageURL.data);

  res.status(200).json({ status: "Success", message: "Image" });
}
