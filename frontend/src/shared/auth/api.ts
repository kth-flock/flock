import { API_BASE_URL } from "../lib/api";
import type { LoginUser, RegisterUser } from "@flock/shared/schemas/auth";
import type { PrivateUser, SerializedUser } from "../types/user";
import { withCreatedAt } from "../lib/user";

export async function login(data: LoginUser) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();

    throw new Error(error.error ?? "Couldn't login");
  }

  const response: {
    status: string;
    data: { user: SerializedUser<PrivateUser> };
  } = await res.json();

  return { user: withCreatedAt(response.data.user) };
}

export async function register(data: RegisterUser) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();

    throw new Error(error.error ?? "Couldn't register your account.");
  }

  const response: {
    status: string;
    data: { user: SerializedUser<PrivateUser> };
  } = await res.json();

  return { user: withCreatedAt(response.data.user) };
}
