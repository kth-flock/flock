"use client";

import { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { FaUserPlus, FaUsers } from "react-icons/fa6";
import ProfileImage from "@/shared/components/profileImage";
import { IconButton } from "@/shared/components/button";
import { openFriendSearch } from "@/features/search/components/inviteBar";
import { FriendsModal } from "@/features/profile/components/friendStack";
import { fullName } from "@/shared/lib/user";
import type { PublicUser } from "@/shared/types/user";

const MAX_SHOWN_FRIENDS = 7;

const messageStyle = "self-center flock-body-sm text-(--color-text-muted)";
const friendLinkStyle =
  "group transition-all hover:scale-110 hover:-translate-y-0.5 hover:-rotate-5";

export default function FriendPreview({
  friends,
}: {
  // undefined while loading, null if it failed
  friends: PublicUser[] | null | undefined;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const shownFriends = friends?.slice(0, MAX_SHOWN_FRIENDS) ?? [];
  const hiddenCount = (friends?.length ?? 0) - shownFriends.length;

  return (
    <div className="flex flex-col items-center w-full gap-4">
      {friends && (
        <FriendsModal
          friends={friends.map((friend) => ({
            ...friend,
            friendshipStatus: "FRIENDS" as const,
          }))}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <span className="inline-flex gap-3 items-center flock-h3 font-sans! font-bold!">
        <FaUsers />
        People you know
      </span>
      <div className="flex flex-row justify-center gap-4 w-full">
        {friends === undefined ? (
          <p className={messageStyle}>Loading…</p>
        ) : friends === null ? (
          <p className={twMerge(messageStyle, "text-error")} role="alert">
            {"Couldn't load your friends"}
          </p>
        ) : friends.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {shownFriends.map((friend) => (
              <Link
                key={friend.id}
                href={`/profile/${friend.id}`}
                title={fullName(friend)}
                className={friendLinkStyle}
              >
                {friend.imageUrl ? (
                  <ProfileImage shadow profileImgSrc={friend.imageUrl} />
                ) : (
                  <ProfileImage
                    shadow
                    firstName={friend.firstName}
                    lastName={friend.lastName}
                  />
                )}
              </Link>
            ))}
            {hiddenCount > 0 && (
              <button
                type="button"
                aria-label={`Show all ${friends.length} friends`}
                onClick={() => setIsModalOpen(true)}
                className={twMerge(
                  friendLinkStyle,
                  "flex size-8 cursor-pointer items-center justify-center rounded-full bg-accent/40 flock-caption text-foreground drop-shadow-lg",
                )}
              >
                +{hiddenCount}
              </button>
            )}
          </div>
        ) : (
          <p className={messageStyle}>No friends added yet</p>
        )}
        <div className="w-px self-stretch bg-primary/20" />
        <IconButton
          size="sm"
          variant="secondary"
          aria-label="Find friends"
          onClick={openFriendSearch}
        >
          <FaUserPlus />
        </IconButton>
      </div>
    </div>
  );
}
