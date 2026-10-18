import { apiFetch } from "@/shared/lib/https";

export async function geocodeFetch<T>(
  path: "search" | "reverse",
  params: Record<string, string>,
) {
  const res = await apiFetch<{ status: string; data: T }>(`/geocode/${path}`, {
    query: params,
  });
  if (res.status !== "Success") throw new Error(`Geocoding ${path} failed`);
  return res.data;
}
