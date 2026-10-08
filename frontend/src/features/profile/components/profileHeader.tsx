import {
  FaUserCheck,
  FaUserClock,
  FaUserGroup,
  FaUserPlus,
} from "react-icons/fa6";
import Button from "@/shared/components/button";
import ProfileImage from "@/shared/components/profileImage";
import { fullName } from "@/shared/lib/user";
import type { ProfileDetails } from "../lib/types";
import type { FriendshipStatus } from "@flock/shared/schemas/user";

type ProfileHeaderProps = {
  profile: ProfileDetails;
  bannerColor: string;
  isOwnProfile?: boolean;
  friendshipStatus?: FriendshipStatus;
};

// TODO: send, accept, decline (and remove) friend requests when clicked
const friendButton: Record<FriendshipStatus, { icon: React.ReactElement; label: string; disabled: boolean }> = {
  NONE: { icon: <FaUserPlus />, label: "Add friend", disabled: false },
  REQUEST_SENT: { icon: <FaUserClock />, label: "Pending", disabled: true },
  REQUEST_RECEIVED: { icon: <FaUserCheck />, label: "Accept", disabled: false },
  FRIENDS: { icon: <FaUserGroup />, label: "Friends", disabled: true },
};

export default function ProfileHeader({
  profile,
  bannerColor,
  isOwnProfile = false,
  friendshipStatus = "NONE",
}: ProfileHeaderProps) {
  const { icon, label, disabled } = friendButton[friendshipStatus];
  
  return (
    <header className="flex flex-col gap-6">
      <div className={`relative h-48 w-full overflow-hidden rounded-2xl shadow-lg md:h-64 ${bannerColor}`}>
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 text-white md:p-8">
          <div className="flex min-w-0 items-center gap-3 drop-shadow-md">
            {profile.imageUrl ? (
              <ProfileImage className="size-16" profileImgSrc={profile.imageUrl} />
            ) : (
              <ProfileImage
                className="size-16"
                firstName={profile.firstName}
                lastName={profile.lastName}
              />
            )}
            <h1 className="flock-h1">{fullName(profile)}</h1>
          </div>

          {!isOwnProfile && (
            <div className="flex shrink-0 items-center gap-2">
              <Button
                icon={icon}
                iconPlacement="left"
                disabled={disabled}
                className="bg-success/60 text-white hover:bg-success/40 disabled:opacity-100 disabled:bg-white/15"
              >
                {label}
              </Button>
              {friendshipStatus === "REQUEST_RECEIVED" && (
                <Button className="bg-error/60 text-white hover:bg-error/40">
                  Decline
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
