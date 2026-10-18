"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { LoginUser, RegisterUser } from "@flock/shared/schemas/auth";
import { ApiError } from "../lib/https";
import type { PrivateUser } from "@/shared/types/user";
import * as api from "./api";

type AuthContextValue = {
  /** undefined = still loading, null = logged out */
  user: PrivateUser | null | undefined;
  /** Re-fetch the current user (call after changing name, image or email) */
  refresh: () => Promise<void>;
  register: (data: RegisterUser) => Promise<void>;
  login: (data: LoginUser) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PrivateUser | null | undefined>(undefined);
  const router = useRouter();

  const refresh = useCallback(async () => {
    try {
      setUser(await api.getCurrentUser());
    } catch {
      // Network failure: on first load treat as logged out so the UI can
      // render, but don't log out someone who is already signed in
      setUser((current) => (current === undefined ? null : current));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(
    async (data: LoginUser) => {
      setUser(await api.login(data));
      router.refresh();
    },
    [router],
  );

  const register = useCallback(
    async (data: RegisterUser) => {
      setUser(await api.register(data));
      router.refresh();
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch (error) {
      // Session already expired: the user is effectively logged out
      if (!(error instanceof ApiError && error.status === 401)) throw error;
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, refresh, register, login, logout }),
    [user, refresh, register, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
