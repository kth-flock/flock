import PostMeta from "./postMeta";
import ReplyForm from "./replyForm";
import type { ExtendedAnnouncment } from "@/shared/types/event";

export default function Announcement({
  announcement,
}: {
  announcement: ExtendedAnnouncment;
}) {
  // Oldest first, replies read top to bottom
  const comments = [...announcement.comments].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  return (
    <li className="flex flex-col gap-3 rounded-2xl border-2 border-neutral p-4 md:p-6">
      <PostMeta user={announcement.user} createdAt={announcement.createdAt} />
      <p className="flock-body whitespace-pre-line">{announcement.content}</p>

      {comments.length > 0 && (
        <ul className="flex flex-col gap-3 border-l-2 border-accent/50 pl-4">
          {comments.map((comment) => (
            <li key={comment.id} className="flex flex-col gap-1">
              <PostMeta user={comment.user} createdAt={comment.createdAt} />
              <p className="flock-body pl-10 whitespace-pre-line">
                {comment.content}
              </p>
            </li>
          ))}
        </ul>
      )}

      <ReplyForm announcementId={announcement.id} />
    </li>
  );
}
