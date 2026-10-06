import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { BUCKET, s3 } from "../s3";

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
};

export async function uploadImage(
  file: Express.Multer.File,
  folder: "events" | "profiles",
) {
  const key = `${folder}/${randomUUID}.${EXTENSIONS[file.mimetype]}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return key;
}
