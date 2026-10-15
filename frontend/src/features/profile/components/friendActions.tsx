"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUserCheck,
  FaUserClock,
  FaUserGroup,
  FaUserPlus,
  FaUserXmark,
} from "react-icons/fa6";
import type { FriendshipStatus } from "@flock/shared/schemas/user";
import Button from "@/shared/components/button";
import {
  acceptFriendRequestFetch,
  removeFriendshipFetch,
  sendFriendRequestFetch,
} from "@/shared/lib/api";

const positiveStyle = "bg-success/60 text-white hover:bg-success/40";
const negativeStyle = "bg-error/60 text-white hover:bg-error/40";
const stateStyle = "group bg-white/15 text-white hover:bg-error/60";

function HoverLabel({
  label,
  hoverLabel,
}: {
  label: string;
  hoverLabel: string;
}) {
  return (
    <>
      <span className="group-hover:hidden">{label}</span>
      <span className="hidden group-hover:inline">{hoverLabel}</span>
    </>
  );
}

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
  const [isConfirmingUnfriend, setIsConfirmingUnfriend] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAction(
    action: (userId: number) => Promise<void>,
    nextStatus: FriendshipStatus,
  ) {
    setIsPending(true);
    setError(null);
    try {
      await action(profileId);
      setStatus(nextStatus);
      setIsConfirmingUnfriend(false);
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

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        {status === "NONE" && (
          <Button
            icon={<FaUserPlus />}
            iconPlacement="left"
            disabled={isPending}
            onClick={() =>
              void runAction(sendFriendRequestFetch, "REQUEST_SENT")
            }
            className={positiveStyle}
          >
            Add friend
          </Button>
        )}

        {status === "REQUEST_RECEIVED" && (
          <>
            <Button
              icon={<FaUserCheck />}
              iconPlacement="left"
              disabled={isPending}
              onClick={() =>
                void runAction(acceptFriendRequestFetch, "FRIENDS")
              }
              className={positiveStyle}
            >
              Accept
            </Button>
            <Button
              disabled={isPending}
              onClick={() => void runAction(removeFriendshipFetch, "NONE")}
              className={negativeStyle}
            >
              Decline
            </Button>
          </>
        )}

        {status === "REQUEST_SENT" && (
          <Button
            icon={<FaUserClock />}
            iconPlacement="left"
            disabled={isPending}
            onClick={() => void runAction(removeFriendshipFetch, "NONE")}
            className={stateStyle}
          >
            <HoverLabel label="Pending" hoverLabel="Cancel request" />
          </Button>
        )}

        {status === "FRIENDS" && (
          <>
            {isConfirmingUnfriend ? (
              <>
                <Button
                  disabled={isPending}
                  onClick={() => setIsConfirmingUnfriend(false)}
                  className="bg-white/15 text-white hover:bg-white/25"
                >
                  Cancel
                </Button>
                <Button
                  icon={<FaUserXmark />}
                  iconPlacement="left"
                  disabled={isPending}
                  onClick={() => void runAction(removeFriendshipFetch, "NONE")}
                  className={negativeStyle}
                >
                  Yes, unfriend
                </Button>
              </>
            ) : (
              <Button
                icon={<FaUserXmark />}
                iconPlacement="left"
                onClick={() => setIsConfirmingUnfriend(true)}
                className={negativeStyle}
              >
                Unfriend
              </Button>
            )}
          </>
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
