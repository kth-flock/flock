import {
  FaCalendarCheck,
  FaHouseChimney,
  FaClock,
  FaUsers,
} from "react-icons/fa6";
import ProfileImage from "@/shared/components/profileImage";
import { fullName } from "@/shared/lib/user";
import type { PublicUser } from "@/shared/types/user";

const MAX_FRIEND_IMAGES = 4;

// Opaque backing so the stacked, see-through profile images don't show each other.
// isolate keeps each backing directly under its own image when they overlap.
const stackedImageStyle =
  "isolate rounded-full bg-background ring-2 ring-background";

function FriendStack({ friends }: { friends: PublicUser[] }) {
  const shownFriends = friends.slice(0, MAX_FRIEND_IMAGES);
  const hiddenCount = friends.length - shownFriends.length;

  return (
    <div className="ml-auto flex -space-x-2">
      {shownFriends.map((friend) => (
        <span
          key={friend.id}
          title={fullName(friend)}
          className={stackedImageStyle}
        >
          {friend.imageUrl ? (
            <ProfileImage profileImgSrc={friend.imageUrl} />
          ) : (
            <ProfileImage
              firstName={friend.firstName}
              lastName={friend.lastName}
            />
          )}
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className={stackedImageStyle}>
          <span className="flex size-8 items-center justify-center rounded-full bg-accent/40 flock-caption text-foreground">
            +{hiddenCount}
          </span>
        </span>
      )}
    </div>
  );
}

export default function ProfileStats({ friends }: { friends: PublicUser[] }) {
  // TODO: Replace the placeholder values with real profile data
  const stats = [
    {
      icon: <FaUsers />,
      value: String(friends.length),
      label: "Friends",
      extra: friends.length > 0 && <FriendStack friends={friends} />,
    },
    { icon: <FaHouseChimney />, value: "3", label: "Events hosted" },
    { icon: <FaCalendarCheck />, value: "8", label: "Events attended" },
    { icon: <FaClock />, value: "Oct 2026", label: "Member since" },
  ];

  return (
    <section className="grid grid-cols-2 gap-6" aria-label="Profile stats">
      {stats.map(({ icon, value, label, extra }) => (
        <div
          key={label}
          className="flex flex-wrap items-center gap-4 rounded-2xl bg-accent/10 p-4 md:p-6"
        >
          <span className="text-secondary shrink-0 [&>svg]:size-8" aria-hidden>
            {icon}
          </span>
          <div className="flex flex-col">
            <p className="flock-h3 text-primary">{value}</p>
            <p className="flock-body-sm text-foreground/80">{label}</p>
          </div>
          {extra}
        </div>
      ))}
    </section>
  );
}
