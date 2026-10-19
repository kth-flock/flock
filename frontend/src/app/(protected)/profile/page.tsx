import type { Metadata } from "next";
import ProfileClient from "@/features/profile/components/profileClient";

export const metadata: Metadata = { title: "My profile • Flock" };

export default async function MyProfilePage() {
  return <ProfileClient />;
}
