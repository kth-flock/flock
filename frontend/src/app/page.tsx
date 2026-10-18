"use client";

import { PublicHomePage } from "@/features/home/publicHomePage";
import PrivateHomePage from "@/features/home/privateHomePage";
import { useAuth } from "@/shared/auth/authContext";

export default function Home() {
  const { user } = useAuth();
  // TODO: Add loading
  if (user === undefined) return null;
  if (user === null) return <PublicHomePage />;
  return <PrivateHomePage />;
}
