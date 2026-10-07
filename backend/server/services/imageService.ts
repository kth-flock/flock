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

export async function withSignedImgUrl<
  T extends { id: number; imageUrl: string | null },
>(record: T): Promise<T> {
  if (!record.imageUrl) return record;
  const expiresIn = 24 * 60 * 60; // Sets time limit to 24 hours

  try {
    const signedImgUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: BUCKET, Key: record.imageUrl }),
      {
        expiresIn,
      },
    );
    return { ...record, imageUrl: signedImgUrl };
  } catch (error) {
    console.error(`Failed to sign image for record ${record.id}`, error);
    return { ...record, imageUrl: null, imageFailed: true }; // adds imageFailed true for frontend to know that error occured
  }
}

export async function deleteImageFromS3(imageKey: string) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: imageKey,
    }),
  );
}
