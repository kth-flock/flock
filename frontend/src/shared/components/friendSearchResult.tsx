import type { FriendshipStatus } from "@flock/shared/schemas/user";
import type { UserSearchResult } from "@/shared/types/user";
import Button from "./button";
import { FaUserCheck, FaUserPlus, FaUser, FaCheck, FaXmark } from "react-icons/fa6";
import ProfileImage from "./profileImage";

type FriendSearchResultProps = {
  user: UserSearchResult;
  isPending?: boolean;
  onAddFriend?: () => void;
  onAcceptFriend?: () => void;
  onDeclineFriend?: () => void;
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
  onAddFriend,
  onAcceptFriend,
  onDeclineFriend,
}: FriendSearchResultProps) {
  const actions: Record<FriendshipStatus, ActionConfig> = {
    NONE: { ariaLabel: "Add Friend", label: "", disabled: false, onClick: onAddFriend, icon: <FaUserPlus aria-hidden />, variant: "primary" },
    REQUEST_SENT: { ariaLabel: "pending...", label: "sent", disabled: true, icon: <></>, variant: "tertiary" },
    FRIENDS: { ariaLabel: "Already Friends", label: "", disabled: true, icon: <></>, variant: "tertiary" },
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

  return (
    <div className="flock-body-sm flex h-full w-full flex-row items-center justify-between py-2 gap-1">
      {user.imageUrl ? (
        <ProfileImage
          profileImgSrc={user.imageUrl}
          firstName={user.firstName}
          lastName={user.lastName}
        />
      ) : (
        <ProfileImage firstName={user.firstName} lastName={user.lastName} />
      )}
      <p className="min-w-0 flex-1 break-words whitespace-normal px-2">
        {user.firstName} {user.lastName}
      </p>
      {user.friendshipStatus === "REQUEST_RECEIVED" && 
          <Button
          variant={action.variant}
          size="sm"
          icon={<FaXmark aria-hidden />}
          iconPlacement="right"
          aria-label={"decline friend request"}
          onClick={onDeclineFriend}
          disabled={action.disabled }
          className="px-1.5"
        >
        </Button>
        }
      <Button
        variant={action.variant}
        size="sm"
        icon={action.icon}
        iconPlacement="right"
        aria-label={action.ariaLabel}
        onClick={action.onClick}
        disabled={action.disabled }
        className="px-1.5"
      >

        {isPending ? "pending..." : action.label}
      </Button>

    </div>
  );
}
