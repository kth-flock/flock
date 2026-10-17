import { API_BASE_URL } from "@/shared/lib/api";

export async function uploadImageFetch(
  file: File,
  folder: "events" | "profiles",
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch(`${API_BASE_URL}/image/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to upload image");
  }

  return res.json();
}

export async function deleteImageFromS3Fetch(imageUrl: string) {
  await fetch(`${API_BASE_URL}/image`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl }),
  });
}
