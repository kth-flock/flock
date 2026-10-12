"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { API_BASE_URL, getCurrentUser } from "@/shared/lib/api";
import type { PrivateUser } from "@/shared/types/user";

// What every consumer can read from the “whiteboard”
type AuthContextValue = {
  user: PrivateUser | null | undefined; // undefined = still loading
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: PrivateUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // undefined = we haven't finished GET /me yet
  const [user, setUser] = useState<PrivateUser | null | undefined>(undefined);

  async function refresh() {
    const me = await getCurrentUser(); // PrivateUser | null
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
