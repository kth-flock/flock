import { deleteImageFromS3Fetch, uploadImageFetch } from "./api";

export async function uploadSelectedImage(
  imageFile: File | null,
): Promise<string | undefined> {
  if (!imageFile) return;
  const { imageUrl } = await uploadImageFetch(imageFile, "events");
  return imageUrl;
}

export async function withUploadedImage<T>(
  imageFile: File | null,
  save: (imageUrl: string | undefined) => Promise<T>,
): Promise<T> {
  const imageUrl = await uploadSelectedImage(imageFile);

  try {
    return await save(imageUrl);
  } catch (error) {
    if (imageUrl) deleteImageFromS3Fetch(imageUrl).catch(() => {});
    throw error;
  }
}
