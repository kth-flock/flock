import { API_BASE_URL } from "../lib/api";
import type { LoginUser, RegisterUser } from "@flock/shared/schemas/auth";
import type { PrivateUser } from "../types/user";

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
    data: { user: PrivateUser };
  } = await res.json();

  return response.data;
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
    data: { user: PrivateUser };
  } = await res.json();

  return response.data;
}
