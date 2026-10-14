import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import ProfileHeader from "@/features/profile/components/profileHeader";
import ProfileContent from "@/features/profile/components/profileContent";
import {
  getFriendshipStatus,
  getMyProfile,
  getProfile,
  getProfileFriends,
} from "@/features/profile/lib/api";
import { randomBannerColor } from "@/features/profile/lib/bannerColor";
import { fullName } from "@/shared/lib/user";

export async function generateMetadata({
  params,
}: PageProps<"/profile/[profileId]">): Promise<Metadata> {
  const { profileId } = await params;
  const cookie = (await cookies()).toString();
  const profile = await getProfile(profileId, cookie);
  return {
    title: profile ? `${fullName(profile)} • Flock` : "Profile not found • Flock",
  };
}

export default async function ProfilePage({
  params,
}: PageProps<"/profile/[profileId]">) {
  const { profileId } = await params;
  const cookie = (await cookies()).toString();
  const [profile, myProfile] = await Promise.all([
    getProfile(profileId, cookie),
    getMyProfile(cookie),
  ]);

  if (!profile) notFound();

  // Change this? If you want to preview your public profile?
  if (profile.id === myProfile?.id) redirect("/profile");

  const [friends, friendshipStatus] = await Promise.all([
    getProfileFriends(profile.id, cookie),
    myProfile
      ? getFriendshipStatus(profile.id, cookie)
      : ("NONE" as const),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
      <ProfileHeader
        profile={profile}
        bannerColor={randomBannerColor()}
        friendshipStatus={friendshipStatus}
      />
      <ProfileContent profile={profile} friends={friends} />
    </main>
  );
}
