import type { UserSearchResult } from "@/shared/types/user";
import Button from "./button";
import { FaUserPlus } from "react-icons/fa6";
import ProfileImage from "./profileImage";

type FriendSearchResultProps = {
  user: UserSearchResult;
  isPending?: boolean;
  onAddFriend?: () => void;
};

export default function FriendSearchResult({
  user,
  isPending,
  onAddFriend,
}: FriendSearchResultProps) {
  return (
    <div className="flock-body-sm flex h-full w-full flex-row items-center justify-between gap-3">
     
      {user.imageUrl ? (
        <ProfileImage
          profileImgSrc={user.imageUrl}
          firstName={user.firstName}
          lastName={user.lastName}
        />
      ) : (
        <ProfileImage firstName={user.firstName} lastName={user.lastName} />
      )} 
      <p className="min-w-0 flex-1 break-words whitespace-normal">
        {user.firstName} {user.lastName}
      </p>
      <Button
        variant="primary"
        size="sm"
        icon={<FaUserPlus aria-hidden />}
        iconPlacement="right"
        onClick={onAddFriend}
        disabled={isPending}
        className="shadow-none transition-none hover:translate-y-0 hover:bg-secondary hover:shadow-none active:translate-y-0  px-1.5 active:shadow-none"
      >
        
      </Button>
    </div>
  );
}
