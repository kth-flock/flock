import Link from "next/link";
import type { FriendshipStatus } from "@flock/shared/schemas/user";
import type { UserSearchResult } from "@/shared/types/user";
import Button, { IconButton } from "../../../shared/components/button";
import { FaUserPlus, FaCheck, FaXmark } from "react-icons/fa6";
import ProfileImage from "../../../shared/components/profileImage";
import { fullName } from "@/shared/lib/user";

type PendingAction = "add" | "accept" | "decline";

type FriendSearchResultProps = {
  user: UserSearchResult;
  isPending?: boolean;
  pendingAction?: PendingAction | null;
  onAddFriend?: () => void;
  onAcceptFriend?: () => void;
  onDeclineFriend?: () => void;
  onOpenProfile?: () => void;
};

type ActionConfig = {
  label: string;
  disabled: boolean;
  onClick?: () => void;
  icon: React.ReactElement;
  variant: ButtonVariant;
  ariaLabel: string;
};

type ButtonVariant = "primary" | "secondary" | "tertiary";

export default function FriendSearchResult({
  user,
  isPending,
  pendingAction = null,
  onAddFriend,
  onAcceptFriend,
  onDeclineFriend,
  onOpenProfile,
}: FriendSearchResultProps) {
  const actions: Record<FriendshipStatus, ActionConfig> = {
    NONE: {
      ariaLabel: "Add Friend",
      label: "",
      disabled: false,
      onClick: onAddFriend,
      icon: <FaUserPlus aria-hidden />,
      variant: "primary",
    },
    REQUEST_SENT: {
      ariaLabel: "pending...",
      label: "sent",
      disabled: true,
      icon: <></>,
      variant: "tertiary",
    },
    FRIENDS: {
      ariaLabel: "Already Friends",
      label: "friends",
      disabled: true,
      icon: <></>,
      variant: "tertiary",
    },
    REQUEST_RECEIVED: {
      ariaLabel: "Accept Friend Request",
      label: "",
      disabled: false,
      onClick: onAcceptFriend,
      icon: <FaCheck aria-hidden />,
      variant: "primary",
    },
  };

  const action = actions[user.friendshipStatus];
  const showPrimaryPending =
    isPending && (pendingAction === "add" || pendingAction === "accept");

  return (
    <div className="flock-body-sm flex h-full w-full flex-row items-center justify-between py-2 gap-1">
      <Link
        href={`/profile/${user.id}`}
        onClick={onOpenProfile}
        className="group/result flex min-w-0 flex-1 items-center"
      >
        <ProfileImage
          firstName={user.firstName}
          lastName={user.lastName}
          profileImgSrc={user.imageUrl ?? ""}
        />
        <span
          className="min-w-0 flex-1 line-clamp-2 wrap-break-word px-2 group-hover/result:underline"
          title={fullName(user)}
        >
          {fullName(user)}
        </span>
      </Link>
      {user.friendshipStatus === "REQUEST_RECEIVED" && (
        <IconButton
          variant="primary"
          size="sm"
          aria-label="decline friend request"
          onClick={onDeclineFriend}
          disabled={action.disabled || isPending}
          className="p-1.5 text-xs md:text-sm [&_svg]:size-3 bg-error hover:bg-error-dark"
        >
          <FaXmark aria-hidden />
        </IconButton>
      )}
      <Button
        variant={action.variant}
        size="sm"
        icon={action.icon}
        iconPlacement="right"
        aria-label={action.ariaLabel}
        onClick={action.onClick}
        disabled={action.disabled || isPending}
        className="px-1.5"
      >
        {showPrimaryPending ? "pending..." : action.label}
      </Button>
    </div>
  );
}
