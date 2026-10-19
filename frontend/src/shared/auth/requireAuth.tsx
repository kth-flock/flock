"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/auth/authContext";
import LoadingStatus from "@/shared/components/loadingStatus";

const AUTH_LOADING_MESSAGES = [
  "Securing the pond…",
  "Verifying your pond privileges…",
  "Making sure you are not a swan…",
  "Fetching your feathers…",
  "Quackifying credentials…",
  "Initiating quack protocol…",
  "Finding your flock…",
];

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) router.replace("/");
  }, [user, router]);

  if (!user) return <LoadingStatus message={AUTH_LOADING_MESSAGES} />;

  return <>{children}</>;
}
