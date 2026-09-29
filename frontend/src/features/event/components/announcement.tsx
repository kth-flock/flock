import type { EventAnnouncement } from "../data";
import PostMeta from "./post-meta";

export default function Announcement({
  announcement,
}: {
  announcement: EventAnnouncement;
}) {
  return (
    <li className="flex flex-col gap-3 rounded-2xl border-2 border-neutral p-4 md:p-6">
      <PostMeta user={announcement.user} createdAt={announcement.createdAt} />
      <p className="whitespace-pre-line">{announcement.content}</p>

      {announcement.comments.length > 0 && (
        <ul className="flex flex-col gap-3 border-l-2 border-accent/50 pl-4">
          {announcement.comments.map((comment) => (
            <li key={comment.id} className="flex flex-col gap-1">
              <PostMeta user={comment.user} createdAt={comment.createdAt} />
              <p className="pl-10 whitespace-pre-line">{comment.content}</p>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
