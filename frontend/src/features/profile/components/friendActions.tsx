"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUserCheck,
  FaUserClock,
  FaUserPlus,
  FaUserXmark,
} from "react-icons/fa6";
import type { FriendshipStatus } from "@flock/shared/schemas/user";
import Button from "@/shared/components/button";
import {
  acceptFriendRequest,
  removeFriendship,
  sendFriendRequest,
} from "@/shared/lib/api";
import { getErrorMessage } from "@/shared/lib/errors";

const positiveStyle = "bg-success/60 text-background hover:bg-success/40";
const negativeStyle = "bg-error/60 text-background hover:bg-error/40";

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
        getErrorMessage(error, "Couldn't update friendship. Please try again."),
      );
      if (!(err instanceof TypeError)) router.refresh();
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
            onClick={() => runAction(sendFriendRequest, "REQUEST_SENT")}
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
              onClick={() => runAction(acceptFriendRequest, "FRIENDS")}
              className={positiveStyle}
            >
              Accept
            </Button>
            <Button
              disabled={isPending}
              onClick={() => runAction(removeFriendship, "NONE")}
              className={negativeStyle}
            >
              Decline
            </Button>
          </>
        )}

        {status === "REQUEST_SENT" && (
          <>
            <span className="flock-body inline-flex items-center gap-1.5 px-2 text-background/80">
              <FaUserClock aria-hidden />
              Pending
            </span>
            <Button
              icon={<FaUserXmark />}
              iconPlacement="left"
              disabled={isPending}
              onClick={() => runAction(removeFriendship, "NONE")}
              className={negativeStyle}
            >
              Cancel request
            </Button>
          </>
        )}

        {status === "FRIENDS" && (
          <>
            {isConfirmingUnfriend ? (
              <>
                <Button
                  disabled={isPending}
                  onClick={() => setIsConfirmingUnfriend(false)}
                  className="bg-white/15 text-background hover:bg-white/25"
                >
                  Cancel
                </Button>
                <Button
                  icon={<FaUserXmark />}
                  iconPlacement="left"
                  disabled={isPending}
                  onClick={() => runAction(removeFriendship, "NONE")}
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
        <p className="flock-caption text-background!" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
