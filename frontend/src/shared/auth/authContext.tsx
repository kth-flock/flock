"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getMeFetch, type MeUser } from "@/shared/lib/apiFetch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// What every consumer can read from the “whiteboard”
type AuthContextValue = {
  user: MeUser | null | undefined; // undefined = still loading
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: MeUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // undefined = we haven't finished GET /me yet
  const [user, setUser] = useState<MeUser | null | undefined>(undefined);

  async function refresh() {
    const me = await getMeFetch(); // MeUser | null
    setUser(me);
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

  return (
    <AuthContext.Provider value={{ user, refresh, logout, setUser }}>
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