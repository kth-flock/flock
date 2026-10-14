import ProfileImage from "@/shared/components/profileImage";
import {
  formatDate,
  formatTime,
  getRelativeDatetime,
} from "@/shared/lib/dateFormat";
import { fullName } from "@/shared/lib/user";
import type { PublicUser } from "@/shared/types/user";
import dayjs from "dayjs";

type PostMetaProps = {
  user: PublicUser;
  createdAt: Date | string;
};

export default function PostMeta({ user, createdAt }: PostMetaProps) {
  return (
    <div className="flex items-center gap-2">
      <ProfileImage
        firstName={user.firstName}
        lastName={user.lastName}
        profileImgSrc={user.imageUrl ?? ""}
      />
      <span className="flock-ui-label">{fullName(user)}</span>
      <time
        dateTime={dayjs(createdAt).toISOString()}
        title={`${formatDate(createdAt)}, ${formatTime(createdAt)}`}
        suppressHydrationWarning
        className="flock-caption"
      >
        {getRelativeDatetime(createdAt)}
      </time>
    </div>
  );
}
