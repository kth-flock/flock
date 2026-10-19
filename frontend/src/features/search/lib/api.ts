import type { UserSearchResult } from "@/shared/types/user";
import { apiData } from "@/shared/lib/https";

export const searchUsers = (query: string) =>
  apiData<UserSearchResult[]>("/users/search", {
    query: { query },
    fallbackError: "Failed to search users",
  });
