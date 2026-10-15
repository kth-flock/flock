"use client";

import { useState } from "react";
import Link from "next/link";
import Modal from "@/shared/components/modal";
import ProfileImage from "@/shared/components/profileImage";
import { fullName } from "@/shared/lib/user";
import type { PublicUser } from "@/shared/types/user";

const MAX_FRIEND_IMAGES = 4;

const stackedImageStyle =
  "isolate rounded-full bg-background ring-2 ring-background";

function FriendsModal({
  friends,
  isOpen,
  onClose,
}: {
  friends: PublicUser[];
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} bg="bg-background">
      <div className="flex flex-col items-center gap-2 text-foreground md:w-md">
        <p className="flock-h4">Friends</p>
        <span className="flock-caption">
          {friends.length} {friends.length === 1 ? "friend" : "friends"}
        </span>
        <ul className="flex w-full flex-col">
          {friends.map((friend) => (
            <li key={friend.id} className="not-last:border-b border-neutral">
              <Link
                href={`/profile/${friend.id}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent/10"
              >
                {friend.imageUrl ? (
                  <ProfileImage profileImgSrc={friend.imageUrl} />
                ) : (
                  <ProfileImage firstName={friend.firstName} lastName={friend.lastName} />
                )}
                <span className="flock-body truncate">{fullName(friend)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}

export default function FriendStack({ friends }: { friends: PublicUser[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const shownFriends = friends.slice(0, MAX_FRIEND_IMAGES);
  const hiddenCount = friends.length - shownFriends.length;

  return (
    <>
      <FriendsModal
        friends={friends}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <button
        type="button"
        aria-label="Show all friends"
        onClick={() => setIsOpen(true)}
        className="ml-auto flex -space-x-2 cursor-pointer rounded-full transition-transform hover:-translate-y-0.5"
      >
        {shownFriends.map((friend) => (
          <span
            key={friend.id}
            title={fullName(friend)}
            className={stackedImageStyle}
          >
            {friend.imageUrl ? (
              <ProfileImage profileImgSrc={friend.imageUrl} />
            ) : (
              <ProfileImage firstName={friend.firstName} lastName={friend.lastName} />
            )}
          </span>
        ))}
        {hiddenCount > 0 && (
          <span className={stackedImageStyle}>
            <span className="flex size-8 items-center justify-center rounded-full bg-accent/40 flock-caption text-foreground">
              +{hiddenCount}
            </span>
          </span>
        )}
      </button>
    </>
  );
}
