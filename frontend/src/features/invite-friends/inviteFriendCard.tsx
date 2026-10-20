import { FaPaperPlane, FaTrash } from "react-icons/fa6";
import Button from "@/shared/components/button";
import type { UserSearchResult } from "@/shared/types/user";
import ProfileImage from "@/shared/components/profileImage";
import { fullName } from "@/shared/lib/user";

type InviteFriendCardProps = {
  user: UserSearchResult;
  isInvited: boolean;
  isPending?: boolean;
  onInvite?: () => void;
  onRemove?: () => void;
};

export default function InviteFriendCard({
  user,
  isInvited,
  isPending = false,
  onInvite,
  onRemove,
}: InviteFriendCardProps) {
  return (
    <div className="bg-background rounded-2xl p-3 flex flex-row gap-4 justify-between items-center">
      <div className="flex min-w-0 flex-row gap-4 items-center">
        <ProfileImage
          className="h-12 w-12"
          firstName={user.firstName}
          lastName={user.lastName}
          profileImgSrc={user.imageUrl ?? ""}
        />

        <div className="flex min-w-0 flex-col">
          <p className="flock-body font-bold! truncate" title={fullName(user)}>
            {fullName(user)}
          </p>
          {user.friendshipStatus !== "NONE" && (
            <p className="flock-caption">Friend</p>
          )}
        </div>
      </div>
      {isInvited ? (
        <Button
          variant="secondary"
          size="sm"
          icon={<FaTrash aria-hidden />}
          iconPlacement="right"
          className="border-error! text-error!"
          onClick={onRemove}
          disabled={isPending}
        >
          {isPending ? "Uninviting..." : "Uninvite"}
        </Button>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          icon={<FaPaperPlane aria-hidden />}
          iconPlacement="right"
          onClick={onInvite}
          disabled={isPending}
        >
          {isPending ? "Inviting..." : "Invite"}
        </Button>
      )}
    </div>
  );
}
