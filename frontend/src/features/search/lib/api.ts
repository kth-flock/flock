import { API_BASE_URL } from "@/shared/lib/api";
import type { UserSearchResult } from "@/shared/types/user";

export async function searchUsers(query: string): Promise<UserSearchResult[]> {
  const params = new URLSearchParams({ query });
  const res = await fetch(`${API_BASE_URL}/users/search?${params}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const response: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(response.error ?? "Failed to search users");
  }

  const response: { status: string; data: UserSearchResult[] } =
    await res.json();

  return response.data;
}
