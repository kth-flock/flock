import {
  imageFolderSchema,
  imageKeySchema,
  imageSchema,
} from "@flock/shared/schemas/common";
import { Request, Response } from "express";
import * as imageServices from "../services/imageService";
import { validate } from "../utils/validate";
import { ValidationError } from "../utils/errors";

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    throw new ValidationError("No file provided");
  }

  const folder = validate(
    imageFolderSchema,
    req.body?.folder,
    "Invalid folder",
  );
  validate(imageSchema, req.file, "Invalid image");

  const imageUrl = await imageServices.uploadImage(req.file, folder);

  res.status(201).json({ imageUrl });
}

export async function deleteImageFromS3(req: Request, res: Response) {
  const imageUrl = validate(
    imageKeySchema,
    req.body?.imageUrl,
    "Invalid key",
  );

  await imageServices.deleteImageFromS3(imageUrl);

  res.status(200).json({ status: "Success", message: "Image deleted" });
}
