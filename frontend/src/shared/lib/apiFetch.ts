export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function geocodeFetch<T>(
  path: "search" | "reverse",
  params: Record<string, string>,
): Promise<T> {
  const res = await fetch(
    `${API_BASE_URL}/geocode/${path}?${new URLSearchParams(params)}`,
  );
  if (!res.ok) throw new Error(`Geocoding ${path} failed`);

  const response: { status: string; data: T } = await res.json();
  if (response.status !== "Success") {
    throw new Error(`Geocoding ${path} failed`);
  }
  return response.data;
}
