import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ProfileHeader from "@/features/profile/components/profileHeader";
import ProfileContent from "@/features/profile/components/profileContent";
import {
  getFriendshipStatus,
  getHostedEvents,
  getInvitedEvents,
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
  const profile = await getProfile(profileId);
  return {
    title: profile ? `${fullName(profile)} • Flock` : "Profile not found • Flock",
  };
}

export default async function ProfilePage({
  params,
}: PageProps<"/profile/[profileId]">) {
  const { profileId } = await params;
  const [profile, myProfile] = await Promise.all([
    getProfile(profileId),
    getMyProfile(),
  ]);

  if (!profile) notFound();

  // Change this? If you want to preview your public profile?
  if (profile.id === myProfile?.id) redirect("/profile");

  const [friends, hostedEvents, invitedEvents, friendshipStatus] =
    await Promise.all([
      getProfileFriends(profile.id),
      getHostedEvents(profile.id),
      getInvitedEvents(profile.id),
      myProfile
        ? getFriendshipStatus(myProfile.id, profile.id)
        : ("NONE" as const),
    ]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
      <ProfileHeader
        profile={profile}
        bannerColor={randomBannerColor()}
        friendshipStatus={friendshipStatus}
      />
      <ProfileContent
        profile={profile}
        friends={friends}
        hostedEvents={hostedEvents}
        invitedEvents={invitedEvents}
      />
    </main>
  );
}
