import { MAX_IMG_SIZE } from "@flock/shared/schemas/common";
import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMG_SIZE },
});
