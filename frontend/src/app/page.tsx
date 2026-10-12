"use client";

import { PrivateHomePage, PublicHomePage } from "@/features/home/homePage";
import { useAuth } from "@/shared/auth/authContext";

export default function Home() {
  const { user } = useAuth();
  if (user === undefined) return null;
  if (user === null) return <PublicHomePage />;
  return <PrivateHomePage />;
}
