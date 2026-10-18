import { apiFetch } from "@/shared/lib/https";

export function uploadImageFetch(file: File, folder: "events" | "profiles") {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  return apiFetch<{ imageUrl: string }>("/image/upload", {
    method: "POST",
    body: form,
    fallbackError: "Failed to upload image",
  });
}

export async function deleteImageFromS3Fetch(imageUrl: string) {
  await apiFetch("/image", {
    method: "DELETE",
    body: { imageUrl },
    fallbackError: "Failed to delete image",
  });
}
