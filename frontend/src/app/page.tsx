"use client";

import { PublicHomePage } from "@/features/home/publicHomePage";
import PrivateHomePage from "@/features/home/privateHomePage";
import { useAuth } from "@/shared/auth/authContext";
import Spinner from "@/shared/components/spinner";

export default function Home() {
  const { user } = useAuth();
  if (user === undefined) return <Spinner className="size-10" />;
  if (user === null) return <PublicHomePage />;
  return <PrivateHomePage />;
}
