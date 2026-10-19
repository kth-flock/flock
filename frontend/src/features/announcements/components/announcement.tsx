"use client";

import { useMemo, useState } from "react";
import { byOldest } from "@/shared/lib/sort";
import type { ExtendedAnnouncement } from "@/shared/types/event";
import Comment from "./comment";
import ReplyForm from "./replyForm";
import EditablePost from "./editablePost";

export default function Announcement({
  announcement,
  onChange,
}: {
  announcement: ExtendedAnnouncement;
  onChange: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const comments = useMemo(
    () => [...announcement.comments].sort(byOldest),
    [announcement.comments],
  );

  function handleRemove() {
    // TODO: delete announcement + related comments
  }

  function handleSave(content: string) {
    // TODO: validate + send to API
    setIsEditing(false);
    onChange();
  }

  return (
    <li className="flex flex-col gap-3 rounded-2xl border-2 border-neutral p-4 md:p-6">
      <EditablePost
        author={announcement.user}
        createdAt={announcement.createdAt}
        content={announcement.content}
        label="update"
        onSave={handleSave}
        onRemove={handleRemove}
        onEditingChange={setIsEditing}
      />

      {comments.length > 0 && (
        <ul className="flex flex-col gap-3 border-l-2 border-accent/50 pl-4">
          {comments.map((comment) => (
            <li key={comment.id}>
              <Comment
                comment={comment}
                disableEdit={isEditing}
                onChange={onChange}
              />
            </li>
          ))}
        </ul>
      )}

      {!isEditing && <ReplyForm announcementId={announcement.id} />}
    </li>
  );
}
