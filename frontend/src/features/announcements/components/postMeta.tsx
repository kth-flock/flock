import ProfileImage from "@/shared/components/profileImage";
import { formatDate, formatTime } from "@/shared/lib/dateFormat";
import { fullName } from "@/shared/lib/user";
import type { PublicUser } from "@/shared/types/user";
import { getRelativeDatetime } from "@/shared/lib/dateFormat";

type PostMetaProps = {
  user: PublicUser;
  createdAt: Date | string;
};

export default function PostMeta({ user, createdAt }: PostMetaProps) {
  const relativeDate = getRelativeDatetime(createdAt);
  const showTime = !(
    relativeDate.includes("now") ||
    relativeDate.includes("minute") ||
    relativeDate.includes("hour")
  );

  const postTime = showTime
    ? `${relativeDate}, ${formatTime(createdAt)}`
    : relativeDate;

  return (
    <div className="flex min-w-0 items-center gap-2">
      <ProfileImage
        firstName={user.firstName}
        lastName={user.lastName}
        profileImgSrc={user.imageUrl ?? ""}
      />
      <span className="flock-ui-label min-w-0 truncate" title={fullName(user)}>
        {fullName(user)}
      </span>
      <time
        dateTime={String(createdAt)}
        className="flock-caption shrink-0 whitespace-nowrap"
      >
        {postTime}
      </time>
    </div>
  );
}
