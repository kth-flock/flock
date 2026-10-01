import UserAvatar from "@/shared/components/userAvatar";
import { formatDate, formatTime } from "@/shared/lib/dateFormat";
import { fullName } from "@/shared/lib/user";
import type { EventComment } from "../lib/types";

export default function PostMeta({
  user,
  createdAt,
}: Pick<EventComment, "user" | "createdAt">) {
  return (
    <div className="flex items-center gap-2">
      <UserAvatar user={user} />
      <span className="flock-ui-label">{fullName(user)}</span>
      <time dateTime={createdAt} className="flock-caption">
        {formatDate(createdAt)}, {formatTime(createdAt)}
      </time>
    </div>
  );
}
