import type { LoginUser, RegisterUser } from "@flock/shared/schemas/auth";
import { apiData, apiDataOrNull, apiFetch } from "../lib/https";
import { withCreatedAt } from "@/shared/lib/user";
import type { Serialized } from "@/shared/types/serialized";
import type { PrivateUser } from "@/shared/types/user";

type RawUser = Serialized<PrivateUser & { createdAt: Date }>;

export async function login(data: LoginUser): Promise<PrivateUser> {
  const { user } = await apiData<{ user: RawUser }>("/auth/login", {
    method: "POST",
    body: data,
    fallbackError: "Couldn't login",
  });
  return withCreatedAt(user);
}

export async function register(data: RegisterUser): Promise<PrivateUser> {
  const { user } = await apiData<{ user: RawUser }>("/auth/register", {
    method: "POST",
    body: data,
    fallbackError: "Couldn't register your account.",
  });
  return withCreatedAt(user);
}

export async function getCurrentUser(): Promise<PrivateUser | null> {
  const user = await apiDataOrNull<RawUser>("/me", {
    nullOn: [401],
    fallbackError: "Failed to get current user",
  });
  return user && withCreatedAt(user);
}

export const logout = () =>
  apiFetch("/auth/logout", {
    method: "POST",
    fallbackError: "Couldn't log out",
  });
