import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ProfileHeader from "@/features/profile/components/profileHeader";
import ProfileContent from "@/features/profile/components/profileContent";
import ProfileHistory from "@/features/profile/components/profileHistory";
import {
  getHostedEvents,
  getInvitedEvents,
  getMyProfile,
  getProfileFriends,
} from "@/features/profile/lib/api";
import { randomBannerColor } from "@/features/profile/lib/bannerColor";

export const metadata: Metadata = { title: "My profile • Flock" };

// Depends on who is logged in (and the random banner colour), so don't prerender at build time
export const dynamic = "force-dynamic";

export default async function MyProfilePage() {
  const profile = await getMyProfile();

  // TODO: point this at the login page once it exists
  if (!profile) redirect("/");

  const [friends, hostedEvents, invitedEvents] = await Promise.all([
    getProfileFriends(profile.id),
    getHostedEvents(profile.id),
    getInvitedEvents(profile.id),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
      <ProfileHeader
        profile={profile}
        bannerColor={randomBannerColor()}
        isOwnProfile
      />
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
        <ProfileContent
          profile={profile}
          friends={friends}
          hostedEvents={hostedEvents}
          invitedEvents={invitedEvents}
          className="grid-cols-2 md:grid-cols-1"
        />
        <div className="border-t border-primary/20 pt-6 md:col-span-2 md:border-t-0 md:border-l md:pt-0 md:pl-6">
          <ProfileHistory
            hostedEvents={hostedEvents}
            invitedEvents={invitedEvents}
          />
        </div>
      </div>
    </main>
  );
}
