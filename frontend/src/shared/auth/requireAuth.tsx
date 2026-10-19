"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/auth/authContext";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) router.replace("/");
  }, [user, router]);

  // undefined = still loading, null = redirecting
  if (!user) return null;

  return <>{children}</>;
}
