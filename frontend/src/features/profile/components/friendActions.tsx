"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUserCheck,
  FaUserClock,
  FaUserGroup,
  FaUserPlus,
} from "react-icons/fa6";
import type { FriendshipStatus } from "@flock/shared/schemas/user";
import Button from "@/shared/components/button";
import {
  acceptFriendRequestFetch,
  removeFriendshipFetch,
  sendFriendRequestFetch,
} from "@/shared/lib/api";

const friendButton: Record<
  FriendshipStatus,
  { icon: React.ReactElement; label: string; disabled: boolean }
> = {
  NONE: { icon: <FaUserPlus />, label: "Add friend", disabled: false },
  REQUEST_SENT: { icon: <FaUserClock />, label: "Pending", disabled: true },
  REQUEST_RECEIVED: { icon: <FaUserCheck />, label: "Accept", disabled: false },
  FRIENDS: { icon: <FaUserGroup />, label: "Friends", disabled: true },
};

// TODO: let "Pending" cancel the request and "Friends" unfriend (removeFriendshipFetch)
export default function FriendActions({
  profileId,
  initialStatus,
}: {
  profileId: number;
  initialStatus: FriendshipStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { icon, label, disabled } = friendButton[status];

  async function runAction(
    action: (userId: number) => Promise<void>,
    nextStatus: FriendshipStatus,
  ) {
    setIsPending(true);
    setError(null);
    try {
      await action(profileId);
      setStatus(nextStatus);
      // Updates the rest of the page, like the friend count
      router.refresh();
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Couldn't reach the server. Try again."
          : err instanceof Error
            ? err.message
            : "Something went wrong",
      );
    } finally {
      setIsPending(false);
    }
  }

  function handleMainClick() {
    if (status === "NONE") {
      void runAction(sendFriendRequestFetch, "REQUEST_SENT");
    } else if (status === "REQUEST_RECEIVED") {
      void runAction(acceptFriendRequestFetch, "FRIENDS");
    }
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <Button
          icon={icon}
          iconPlacement="left"
          disabled={disabled || isPending}
          onClick={handleMainClick}
          className="bg-success/60 text-white hover:bg-success/40 disabled:opacity-100 disabled:bg-white/15"
        >
          {label}
        </Button>
        {status === "REQUEST_RECEIVED" && (
          <Button
            disabled={isPending}
            onClick={() => void runAction(removeFriendshipFetch, "NONE")}
            className="bg-error/60 text-white hover:bg-error/40"
          >
            Decline
          </Button>
        )}
      </div>
      {error && (
        <p className="flock-caption text-white!" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
