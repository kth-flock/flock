import { twMerge } from "tailwind-merge";
import ProfileImage from "@/shared/components/profileImage";
import { fullName } from "@/shared/lib/user";
import type { PublicUser, PrivateUser } from "@/shared/types/user";
import ProfileSettings from "./profileSettings";
import LogoutButton from "./logoutButton";
import FriendActions from "./friendActions";
import CopyProfileLink from "./copyProfileLink";
import type { FriendshipStatus } from "@flock/shared/schemas/user";

type ProfileHeaderProps = {
  profile: PublicUser | PrivateUser;
  bannerColor: string;
  isOwnProfile?: boolean;
  friendshipStatus?: FriendshipStatus;
  email?: string;
};

export default function ProfileHeader({
  profile,
  bannerColor,
  isOwnProfile = false,
  friendshipStatus,
  email = "",
}: ProfileHeaderProps) {
  return (
    <header className="flex flex-col gap-6">
      <div
        className={twMerge(
          "relative h-48 w-full overflow-hidden rounded-2xl shadow-lg md:h-64",
          bannerColor,
        )}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute right-4 top-4 md:right-6 md:top-6">
          <CopyProfileLink profileId={profile.id} />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 text-white md:p-8">
          <div className="flex min-w-0 items-center gap-3 drop-shadow-md">
            <ProfileImage
              className="size-16"
              firstName={profile.firstName}
              lastName={profile.lastName}
              profileImgSrc={profile.imageUrl ?? ""}
            />
            <h1
              className="flock-h1 min-w-0 line-clamp-2 wrap-break-word"
              title={fullName(profile)}
            >
              {fullName(profile)}
            </h1>
          </div>

          {isOwnProfile && "email" in profile && (
            <div className="flex shrink-0 items-start gap-2">
              <ProfileSettings profile={profile} email={email} />
              <LogoutButton />
            </div>
          )}

          {!isOwnProfile && friendshipStatus && (
            <FriendActions
              key={friendshipStatus}
              profileId={profile.id}
              initialStatus={friendshipStatus}
            />
          )}
        </div>
      </div>
    </header>
  );
}
