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
import FlockLoader from "@/shared/components/flockLoader";

export default function ProfileClient() {
  const { user } = useAuth();
  const [bannerColor] = useState(randomBannerColor);
  const {
    data: hostedEvents,
    isLoading: createdLoading,
    error: createdError,
    refetch: refetchCreated,
  } = useFetch(getCreatedEvents);
  const {
    data: invitedEvents,
    isLoading: invitedLoading,
    error: invitedError,
    refetch: refetchInvited,
  } = useFetch(getInvitedEvents);
  const {
    data: friends,
    isLoading: friendsLoading,
    error: friendsError,
    refetch: refetchFriends,
  } = useFetch(getMyFriends);

  if (user === undefined) return <FlockLoader />;
  if (!user) notFound();

  const friendsWithStatus = friendsLoading
    ? undefined
    : friendsError
      ? null
      : (friends?.map((friend) => ({
          ...friend,
          friendshipStatus: "FRIENDS" as const,
        })) ?? null);

  const historyLoading = createdLoading || invitedLoading;
  const historyError =
    !historyLoading && (createdError || invitedError)
      ? (createdError ?? invitedError)
      : null;

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
          friendsError={friendsError}
          onFriendsRetry={refetchFriends}
          hostedEvents={hostedEvents}
          invitedEvents={invitedEvents}
          className="grid-cols-2 md:grid-cols-1"
        />
        <div className="border-t border-primary/20 pt-6 md:col-span-2 md:border-t-0 md:border-l md:pt-0 md:pl-6">
          <ProfileHistory
            hostedEvents={hostedEvents}
            invitedEvents={invitedEvents}
            isLoading={historyLoading}
            error={historyError}
            onRetry={() => {
              void refetchCreated();
              void refetchInvited();
            }}
          />
        </div>
      </div>
    </div>
  );
}
