import { FaUser, FaPaperPlane, FaTrash } from "react-icons/fa6";
import Button from "@/shared/components/button";
import type { UserSearchResult } from "@/shared/types/user";

type InviteFriendCardProps = {
  user: UserSearchResult;
  isInvited: boolean;
  onInvite?: () => void;
  onRemove?: () => void;
};

export default function InviteFriendCard({
  user,
  isInvited,
  onInvite,
  onRemove,
}: InviteFriendCardProps) {
  return (
    <div className="bg-white rounded-2xl p-3 flex flex-row justify-between items-center">
      <div className="flex flex-row gap-4 items-center">
        {user.imageUrl ? (
          ""
        ) : (
          <div className="rounded-full w-12 h-12 border-primary border-3 flex items-end justify-center overflow-clip">
            <FaUser className="fill-primary" size={36} />
          </div>
        )}

        <div className="flex flex-col">
          <p className="flock-body font-bold!">
            {user.firstName} {user.lastName}
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
        >
          Remove
        </Button>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          icon={<FaPaperPlane aria-hidden />}
          iconPlacement="right"
          onClick={onInvite}
        >
          Invite
        </Button>
      )}
    </div>
  );
}
