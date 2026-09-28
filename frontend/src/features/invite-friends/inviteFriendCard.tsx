import { FaUser, FaPaperPlane, FaTrash } from "react-icons/fa6";
import Button from "@/shared/components/button";

type InviteFriendCardProps = {
  profileImg?: string;
  name: string;
  isInvited: boolean;
  isFriend: boolean;
  onInvite?: () => void;
  onRemove?: () => void;
};

export default function InviteFriendCard({
  profileImg,
  name,
  isInvited,
  isFriend,
  onInvite,
  onRemove,
}: InviteFriendCardProps) {
  return (
    <div className="bg-white rounded-2xl p-3 flex flex-row justify-between items-center">
      <div className="flex flex-row gap-4 items-center">
        {profileImg ? (
          ""
        ) : (
          <div className="rounded-full w-12 h-12 border-primary border-3 flex items-end justify-center overflow-clip">
            <FaUser className="fill-primary" size={36} />
          </div>
        )}

        <div className="flex flex-col">
          <p className="flock-body font-bold!">{name}</p>
          {isFriend && <p className="flock-caption">Friend</p>}
        </div>
      </div>
      {isInvited ? (
        <Button
          variant="secondary"
          size="sm"
          icon={<FaTrash />}
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
          icon={<FaPaperPlane />}
          iconPlacement="right"
          onClick={onInvite}
        >
          Invite
        </Button>
      )}
    </div>
  );
}
