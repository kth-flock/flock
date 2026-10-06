import { FaUsers } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa6";
import ProfileImage from "@/shared/components/profileImage";
import { IconButton } from "@/shared/components/button";
import type { PublicUser } from "@/shared/types/user";
import Link from "next/link";

export default function FriendPreview({ friends }: { friends: PublicUser[] }) {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <span className="inline-flex gap-3 items-center flock-h3 font-sans! font-bold!">
        <FaUsers />
        People you know
      </span>
      <div className="flex flex-row justify-center gap-4 w-full">
        {friends.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {friends.map((friend) => (
              <Link key={friend.id} href={`/profile/${friend.id}`} title={`${friend.firstName} ${friend.lastName}`} className="group transition-all hover:scale-110 hover:-translate-y-0.5 hover:-rotate-5">
                {friend.imageUrl ? (
                  <ProfileImage shadow profileImgSrc={friend.imageUrl} />
                ) : (
                  <ProfileImage shadow firstName={friend.firstName} lastName={friend.lastName}
                  />
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="self-center flock-body-sm text-(--color-text-muted)">
            No friends added yet
          </p>
        )}
        <div className="w-px self-stretch bg-primary/20" />{" "}
        <IconButton size="sm" variant="secondary">
          <FaUserPlus />
        </IconButton>
      </div>
    </div>
  );
}
