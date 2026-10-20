"use client";

import { notFound } from "next/navigation";
import ProfileHeader from "@/features/profile/components/profileHeader";
import ProfileContent from "@/features/profile/components/profileContent";
import EventsTogether from "@/features/profile/components/eventsTogether";
import {
  getEventsTogether,
  getMyFriendshipStatuses,
  getProfile,
  getProfileFriends,
} from "@/features/profile/lib/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/auth/authContext";
import { randomBannerColor } from "../lib/bannerColor";
import { useFetch } from "@/shared/hooks/useFetch";
import type { PrivateUser } from "@/shared/types/user";
import ProfilePageSkeleton from "./profilePageSkeleton";
import ErrorState from "@/shared/components/ErrorState";

export default function PublicProfileClient({
  profileId,
}: {
  profileId: number;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const isSelf = user?.id === profileId;

  useEffect(() => {
    if (isSelf) router.replace("/profile");
  }, [isSelf, router]);

  if (!user || isSelf) return null;

  return <PublicProfileData profileId={profileId} user={user} />;
}

function PublicProfileData({
  profileId,
  user,
}: {
  profileId: number;
  user: PrivateUser;
}) {
  const fetchProfile = useCallback(() => getProfile(profileId), [profileId]);
  const fetchFriends = useCallback(
    () => getProfileFriends(profileId),
    [profileId],
  );
  const fetchEventsTogether = useCallback(
    () => getEventsTogether(profileId),
    [profileId],
  );

  const [bannerColor] = useState(randomBannerColor);

  const { data: profile, error, errorStatus, isLoading, refetch } =
    useFetch(fetchProfile);
  const {
    data: friends,
    isLoading: friendsLoading,
    error: friendsError,
    refetch: refetchFriends,
  } = useFetch(fetchFriends);
  const { data: friendStatuses } = useFetch(getMyFriendshipStatuses);
  const {
    data: eventsTogether,
    error: eventsTogetherError,
    isLoading: isLoadingEventsTogether,
    refetch: refetchEventsTogether,
  } = useFetch(fetchEventsTogether);

  const friendsWithStatus = useMemo(() => {
    if (friendsLoading) return undefined;
    if (friendsError || !friends) return null;
    return friends.map((friend) => ({
      ...friend,
      friendshipStatus: friendStatuses?.get(friend.id) ?? ("NONE" as const),
    }));
  }, [friends, friendsLoading, friendsError, friendStatuses]);

  if (isLoading) return <ProfilePageSkeleton />;
  if (errorStatus === 404) notFound();
  if (error) {
    return (
      <ErrorState
        title="Something went wrong"
        message={error}
        action={{ label: "Try again", onClick: refetch }}
      />
    );
  }
  if (!profile) notFound();

  const friendshipStatus = friendStatuses
    ? (friendStatuses.get(profile.id) ?? "NONE")
    : undefined;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
      <ProfileHeader
        profile={profile}
        bannerColor={bannerColor}
        friendshipStatus={friendshipStatus}
      />
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
        <ProfileContent
          profile={profile}
          friends={friendsWithStatus}
          friendsError={friendsError}
          onFriendsRetry={refetchFriends}
          myId={friendStatuses ? user.id : undefined}
          className="grid-cols-2 md:grid-cols-1"
        />
        <div className="border-t border-primary/20 pt-6 md:col-span-2 md:border-t-0 md:border-l md:pt-0 md:pl-6">
          <EventsTogether
            events={eventsTogether}
            error={eventsTogetherError}
            onRetry={refetchEventsTogether}
            myId={user.id}
            isLoading={isLoadingEventsTogether}
          />
        </div>
      </div>
    </div>
  );
}
