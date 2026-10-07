import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ProfileHeader from "@/features/profile/components/profileHeader";
import { getMyProfile } from "@/features/profile/lib/api";
import { randomBannerColor } from "@/features/profile/lib/bannerColor";

export const metadata: Metadata = { title: "My profile • Flock" };

// Depends on who is logged in (and the random banner colour), so don't prerender at build time
export const dynamic = "force-dynamic";

export default async function MyProfilePage() {
  const profile = await getMyProfile();

  // TODO: point this at the login page once it exists
  if (!profile) redirect("/");

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
      <ProfileHeader
        profile={profile}
        bannerColor={randomBannerColor()}
        isOwnProfile
      />
    </main>
  );
}
