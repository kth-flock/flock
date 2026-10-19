"use client";

import { PublicHomePage } from "@/features/home/publicHomePage";
import PrivateHomePage from "@/features/home/privateHomePage";
import { useAuth } from "@/shared/auth/authContext";
import FlockLoader from "@/shared/components/flockLoader";

export default function Home() {
  
  const { user } = useAuth();
  if (user === undefined) return <FlockLoader />;
  if (user === null) return <PublicHomePage />;
  return <PrivateHomePage />;
}
