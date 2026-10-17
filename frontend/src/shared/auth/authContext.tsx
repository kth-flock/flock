"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { API_BASE_URL, getCurrentUser } from "@/shared/lib/api";
import * as api from "./api";
import type { PrivateUser } from "@/shared/types/user";
import { LoginUser, RegisterUser } from "@flock/shared/schemas/auth";
import { useRouter } from "next/navigation";

// What every consumer can read from the “whiteboard”
type AuthContextValue = {
  user: PrivateUser | null | undefined; // undefined = still loading
  refresh: () => Promise<void>;
  register: (data: RegisterUser) => Promise<void>;
  login: (data: LoginUser) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: PrivateUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // undefined = we haven't finished GET /me yet
  const [user, setUser] = useState<PrivateUser | null | undefined>(undefined);
  const router = useRouter();

  async function refresh() {
    try {
      const me = await getCurrentUser(); // PrivateUser | null
      setUser(me);
    } catch {
      // Network/CORS/extension failures — treat as logged out so UI can render
      setUser(null);
    }
  }

  // Run once when the app loads
  useEffect(() => {
    void refresh();
  }, []);

  async function logout() {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }

  async function login(data: LoginUser) {
    const { user } = await api.login(data);
    setUser(user);
    router.refresh();
  }

  async function register(data: RegisterUser) {
    const { user } = await api.register(data);
    setUser(user);
    router.refresh();
  }

  return (
    <AuthContext.Provider
      value={{ user, refresh, register, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook for HomePage, Navbar, etc.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
