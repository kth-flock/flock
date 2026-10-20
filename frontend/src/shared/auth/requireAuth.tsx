"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/auth/authContext";
import FlockLoader from "@/shared/components/flockLoader";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) router.replace("/");
  }, [user, router]);

  if (!user) return <FlockLoader />;

  return <>{children}</>;
}
