import { FaUserPlus } from "react-icons/fa6";
import Button from "@/shared/components/button";
import ProfileImage from "@/shared/components/profileImage";
import { fullName } from "@/shared/lib/user";
import type { ProfileDetails } from "../lib/types";

type ProfileHeaderProps = {
  profile: ProfileDetails;
  bannerColor: string;
  isOwnProfile?: boolean;
};

export default function ProfileHeader({
  profile,
  bannerColor,
  isOwnProfile = false,
}: ProfileHeaderProps) {
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

          {/* TODO: send a friend request + reflect the friendship status */}
          {!isOwnProfile && (
            <Button
              icon={<FaUserPlus />}
              iconPlacement="left"
              className="shrink-0 bg-accent/40 text-white hover:bg-neutral/20"
            >
              Add friend
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
