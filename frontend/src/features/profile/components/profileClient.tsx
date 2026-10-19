"use client";

import { useState } from "react";
import ProfileHeader from "./profileHeader";
import { randomBannerColor } from "../lib/bannerColor";
import ProfileContent from "./profileContent";
import ProfileHistory from "./profileHistory";
import { useFetch } from "@/shared/hooks/useFetch";
import { getMyFriends } from "@/shared/lib/api";
import { getCreatedEvents, getInvitedEvents } from "@/features/event/lib/api";
import { useAuth } from "@/shared/auth/authContext";
import { notFound } from "next/navigation";

export default function ProfileClient() {
  const { user } = useAuth();
  const [bannerColor] = useState(randomBannerColor);
  const { data: hostedEvents, isLoading: createdLoading } =
    useFetch(getCreatedEvents);
  const { data: invitedEvents, isLoading: invitedLoading } =
    useFetch(getInvitedEvents);
  const { data: friends, isLoading: friendsLoading } = useFetch(getMyFriends);

  // TODO: Add error handling
  if (user === undefined) return;
  if (!user) notFound();

  const friendsWithStatus = friendsLoading
    ? undefined
    : (friends?.map((friend) => ({
        ...friend,
        friendshipStatus: "FRIENDS" as const,
      })) ?? null);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
      <ProfileHeader
        profile={user}
        bannerColor={bannerColor}
        isOwnProfile
        email={user.email}
      />
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
        <ProfileContent
          profile={user}
          friends={friendsWithStatus}
          hostedEvents={hostedEvents}
          invitedEvents={invitedEvents}
          className="grid-cols-2 md:grid-cols-1"
        />
        <div className="border-t border-primary/20 pt-6 md:col-span-2 md:border-t-0 md:border-l md:pt-0 md:pl-6">
          <ProfileHistory
            hostedEvents={hostedEvents}
            invitedEvents={invitedEvents}
            isLoading={createdLoading || invitedLoading}
          />
        </div>
      </div>
    </div>
  );
}
