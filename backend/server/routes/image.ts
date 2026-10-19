import { Router } from "express";
import { uploadImage, deleteImageFromS3 } from "../controllers/imageController";
import { upload } from "../middleware/uploadMiddleware";

export const imageRouter = Router();

imageRouter.post("/upload", upload.single("file"), uploadImage);
imageRouter.delete("/", deleteImageFromS3);
