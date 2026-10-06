import { Router } from "express";
import { uploadImage } from "../controllers/imageController";
import { upload } from "../middleware/uploadMiddleware";

export const imageRouter = Router();

// "file" - name needs to be the same as form input in frontend
imageRouter.post("/upload", upload.single("file"), uploadImage);
