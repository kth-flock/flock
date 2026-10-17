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

type UserWithImage = { id: number; imageUrl: string | null };

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

export async function getObjectWithImage<
  T extends { id: number; imageUrl: string | null },
>(record: T): Promise<T> {
  if (!record.imageUrl) return record;
  const expiresIn = 24 * 60 * 60;

  try {
    const signedImageUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: BUCKET, Key: record.imageUrl }),
      {
        expiresIn,
      },
    );
    return { ...record, imageUrl: signedImageUrl };
  } catch (error) {
    console.error(`Failed to sign image for record ${record.id}`, error);
    return { ...record, imageUrl: null };
  }
}

export async function getEventAndUserWithImage<
  T extends {
    id: number;
    imageUrl: string | null;
    createdBy?: UserWithImage;
    invitees?: { user: UserWithImage }[];
  },
>(event: T) {
  const signed = await getObjectWithImage(event);

  const createdBy =
    event.createdBy && (await getObjectWithImage(event.createdBy));

  const invitees =
    event.invitees &&
    (await Promise.all(
      event.invitees.map(async (invitee) => ({
        ...invitee,
        user: await getObjectWithImage(invitee.user),
      })),
    ));

  return { ...signed, createdBy, invitees };
}

export async function deleteImageFromS3(imageUrl: string) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: imageUrl,
    }),
  );
}
