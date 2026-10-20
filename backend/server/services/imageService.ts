import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { BUCKET, s3 } from "../s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
};

export async function uploadImage(
  file: Express.Multer.File,
  folder: "events" | "profiles",
) {
  const imageKey = `${folder}/${randomUUID()}.${EXTENSIONS[file.mimetype]}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: imageKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return imageKey;
}

export async function signImageKey(key: string) {
  try {
    return await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: BUCKET, Key: key }),
      { expiresIn: 24 * 60 * 60 },
    );
  } catch (error) {
    console.error(`Failed to sign image ${key}`, error);
    return null;
  }
}

export async function deleteImageFromS3(imageUrl: string) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: imageUrl,
    }),
  );
}
