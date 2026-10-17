import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import ProfileHeader from "@/features/profile/components/profileHeader";
import ProfileContent from "@/features/profile/components/profileContent";
import EventsTogether from "@/features/profile/components/eventsTogether";
import {
  getEventsTogether,
  getMyFriendshipStatuses,
  getMyProfile,
  getProfile,
  getProfileFriends,
  orNull,
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

  if (!myProfile) redirect("/login");

  if (profile.id === myProfile.id) redirect("/profile");

  const [friends, myStatuses, eventsTogether] = await Promise.all([
    orNull(getProfileFriends(profile.id, cookie)),
    orNull(getMyFriendshipStatuses(cookie)),
    orNull(getEventsTogether(profile.id, cookie)),
  ]);

  const friendshipStatus = myStatuses
    ? (myStatuses.get(profile.id) ?? "NONE")
    : undefined;
  const friendsWithStatus =
    friends?.map((friend) => ({
      ...friend,
      friendshipStatus: myStatuses?.get(friend.id) ?? "NONE",
    })) ?? null;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
      <ProfileHeader
        profile={profile}
        bannerColor={randomBannerColor()}
        friendshipStatus={friendshipStatus}
      />
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
        <ProfileContent
          profile={profile}
          friends={friendsWithStatus}
          myId={myStatuses ? myProfile.id : undefined}
          className="grid-cols-2 md:grid-cols-1"
        />
        <div className="border-t border-primary/20 pt-6 md:col-span-2 md:border-t-0 md:border-l md:pt-0 md:pl-6">
          <EventsTogether events={eventsTogether} myId={myProfile.id} />
        </div>
      </div>
    </main>
  );
}
