"use client";

import { useState } from "react";
import Link from "next/link";
import { FaCheck, FaUserClock, FaUserPlus, FaXmark } from "react-icons/fa6";
import type { FriendshipStatus } from "@flock/shared/schemas/user";
import { IconButton } from "@/shared/components/button";
import Modal from "@/shared/components/modal";
import ProfileImage from "@/shared/components/profileImage";
import {
  acceptFriendRequest,
  declineFriendRequest,
  sendFriendRequest,
} from "@/shared/lib/api";
import { fullName } from "@/shared/lib/user";
import type { UserSearchResult } from "@/shared/types/user";
import { getErrorMessage } from "@/shared/lib/errors";

const MAX_FRIEND_IMAGES = 4;

const stackedImageStyle =
  "isolate rounded-full bg-background ring-2 ring-background";

function FriendRowActions({
  friend,
  myId,
  isPending,
  onAction,
}: {
  friend: UserSearchResult;
  myId: number;
  isPending: boolean;
  onAction: (
    action: (userId: number) => Promise<void>,
    nextStatus: FriendshipStatus,
  ) => void;
}) {
  if (friend.id === myId) {
    return <span className="flock-caption shrink-0 px-2">You</span>;
  }

  switch (friend.friendshipStatus) {
    case "NONE":
      return (
        <IconButton
          size="sm"
          aria-label={`Add ${fullName(friend)} as friend`}
          disabled={isPending}
          onClick={() => onAction(sendFriendRequest, "REQUEST_SENT")}
        >
          <FaUserPlus aria-hidden />
        </IconButton>
      );
    case "REQUEST_RECEIVED":
      return (
        <div className="flex shrink-0 items-center gap-1">
          <IconButton
            size="sm"
            aria-label={`Decline friend request from ${fullName(friend)}`}
            disabled={isPending}
            onClick={() => onAction(declineFriendRequest, "NONE")}
            className="bg-error hover:bg-error-dark"
          >
            <FaXmark aria-hidden />
          </IconButton>
          <IconButton
            size="sm"
            aria-label={`Accept friend request from ${fullName(friend)}`}
            disabled={isPending}
            onClick={() => onAction(acceptFriendRequest, "FRIENDS")}
          >
            <FaCheck aria-hidden />
          </IconButton>
        </div>
      );
    case "REQUEST_SENT":
      return (
        <span className="flock-caption inline-flex shrink-0 items-center gap-1 px-2">
          <FaUserClock aria-hidden />
          Pending
        </span>
      );
    case "FRIENDS":
      return null;
  }
}

export function FriendsModal({
  friends,
  myId,
  isOpen,
  onClose,
  pendingId = null,
  error = null,
  onAction,
}: {
  friends: UserSearchResult[];
  myId?: number;
  isOpen: boolean;
  onClose: () => void;
  pendingId?: number | null;
  error?: string | null;
  onAction?: (
    friendId: number,
    action: (userId: number) => Promise<void>,
    nextStatus: FriendshipStatus,
  ) => void;
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
            <li
              key={friend.id}
              className="flex items-center gap-2 rounded-lg pr-2 transition-colors not-last:border-b border-neutral has-[a:hover]:bg-accent/10"
            >
              <Link
                href={`/profile/${friend.id}`}
                onClick={onClose}
                className="flex min-w-0 flex-1 items-center gap-3 p-2"
              >
                <ProfileImage
                  firstName={friend.firstName}
                  lastName={friend.lastName}
                  profileImgSrc={friend.imageUrl ?? ""}
                />
                <span className="flock-body truncate">{fullName(friend)}</span>
              </Link>
              {myId !== undefined && onAction && (
                <FriendRowActions
                  friend={friend}
                  myId={myId}
                  isPending={pendingId === friend.id}
                  onAction={(action, nextStatus) =>
                    onAction(friend.id, action, nextStatus)
                  }
                />
              )}
            </li>
          ))}
        </ul>
        {error && (
          <p className="flock-caption text-error!" role="alert">
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}

export default function FriendStack({
  friends,
  myId,
}: {
  friends: UserSearchResult[];
  myId?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [changedStatuses, setChangedStatuses] = useState<
    Record<number, FriendshipStatus>
  >({});
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const friendsWithStatus = friends.map((friend) => ({
    ...friend,
    friendshipStatus: changedStatuses[friend.id] ?? friend.friendshipStatus,
  }));
  const shownFriends = friends.slice(0, MAX_FRIEND_IMAGES);
  const hiddenCount = friends.length - shownFriends.length;

  async function handleAction(
    friendId: number,
    action: (userId: number) => Promise<void>,
    nextStatus: FriendshipStatus,
  ) {
    setPendingId(friendId);
    setError(null);
    try {
      await action(friendId);
      setChangedStatuses((prev) => ({ ...prev, [friendId]: nextStatus }));
    } catch (err) {
      setError(
        getErrorMessage(err, "Couldn't update friendship. Please try again."),
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <>
      <FriendsModal
        friends={friendsWithStatus}
        myId={myId}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setError(null);
        }}
        pendingId={pendingId}
        error={error}
        onAction={(friendId, action, nextStatus) =>
          handleAction(friendId, action, nextStatus)
        }
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
            <ProfileImage
              firstName={friend.firstName}
              lastName={friend.lastName}
              profileImgSrc={friend.imageUrl ?? ""}
            />
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
