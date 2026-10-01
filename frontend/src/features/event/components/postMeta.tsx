import type { EventComment } from "../types";
import { formatDate, formatTime, fullName } from "../format";
import UserAvatar from "./user-avatar";

export default function PostMeta({
  user,
  createdAt,
}: Pick<EventComment, "user" | "createdAt">) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <UserAvatar user={user} />
      <span className="font-semibold">{fullName(user)}</span>
      <time dateTime={createdAt} className="text-foreground/60">
        {formatDate(createdAt)}, {formatTime(createdAt)}
      </time>
    </div>
  );
}
