import ProfileImage from "@/shared/components/profileImage";
import { formatDate, formatTime } from "@/shared/lib/dateFormat";
import { fullName } from "@/shared/lib/user";
import type { User } from "@prisma/types";

type PostMetaProps = {
  user: User;
  createdAt: Date;
};

export default function PostMeta({ user, createdAt }: PostMetaProps) {
  return (
    <div className="flex items-center gap-2">
      {user.imageUrl ? (
        <ProfileImage profileImgSrc={user.imageUrl} />
      ) : (
        <ProfileImage firstName={user.firstName} lastName={user.lastName} />
      )}
      <span className="flock-ui-label">{fullName(user)}</span>
      <time dateTime={String(createdAt)} className="flock-caption">
        {formatDate(createdAt)}, {formatTime(createdAt)}
      </time>
    </div>
  );
}
