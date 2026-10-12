import { uploadImageFetch } from "./api";

export async function uploadSelectedImage(
  imageFile: File | null,
): Promise<string | undefined> {
  if (!imageFile) return;
  const { imageUrl } = await uploadImageFetch(imageFile, "events");
  return imageUrl;
}
