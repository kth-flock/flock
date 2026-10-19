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

  const { data: profile, error, isLoading } = useFetch(fetchProfile);
  const { data: friends } = useFetch(fetchFriends);
  const { data: friendStatuses } = useFetch(getMyFriendshipStatuses);
  const { data: eventsTogether } = useFetch(fetchEventsTogether);

  const friendsWithStatus = useMemo(
    () =>
      friends?.map((friend) => ({
        ...friend,
        friendshipStatus: friendStatuses?.get(friend.id) ?? ("NONE" as const),
      })) ?? null,
    [friends, friendStatuses],
  );

  // TODO: Error
  if (isLoading) return <ProfilePageSkeleton />;
  if (error) return;
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
          myId={friendStatuses ? user.id : undefined}
          className="grid-cols-2 md:grid-cols-1"
        />
        <div className="border-t border-primary/20 pt-6 md:col-span-2 md:border-t-0 md:border-l md:pt-0 md:pl-6">
          <EventsTogether events={eventsTogether} myId={user.id} />
        </div>
      </div>
    </div>
  );
}
