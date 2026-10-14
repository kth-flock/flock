"use client";

import PostMeta from "./postMeta";
import ReplyForm from "./replyForm";
import type { ExtendedAnnouncment } from "@/shared/types/event";
import { useAuth } from "@/shared/auth/authContext";
import { FaTrash, FaPenToSquare } from "react-icons/fa6";
import Button, { IconButton } from "@/shared/components/button";
import Comment from "./comment";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TextArea } from "@/shared/components/formInputs";

export default function Announcement({
  announcement,
}: {
  announcement: ExtendedAnnouncment;
}) {
  const { user } = useAuth();

  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [anouncementDraft, setAnnouncementDraft] = useState<string>(
    announcement.content,
  );

  function handleRemove() {
    // TODO: delete announcement + related comments
  }

  function handleSubmitEdit() {
    // TODO: validate + send to API
    setIsEditing(false);
    router.refresh();
  }

  // Oldest first, replies read top to bottom
  const comments = [...announcement.comments].sort(
    (a, b) => Date.parse(String(b.createdAt)) - Date.parse(String(a.createdAt)),
  );

  return (
    <li className="flex flex-col gap-3 rounded-2xl border-2 border-neutral p-4 md:p-6">
      <div className="inline-flex items-center justify-between">
        <PostMeta user={announcement.user} createdAt={announcement.createdAt} />
        {user?.id === announcement.user.id && !isEditing && (
          <span className="inline-flex">
            <IconButton
              variant="tertiary"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <FaPenToSquare aria-label="Edit" />
            </IconButton>
            <IconButton
              variant="tertiary"
              size="sm"
              className="text-error!"
              onClick={handleRemove}
            >
              <FaTrash aria-label="Remove" />
            </IconButton>
          </span>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmitEdit} className="flex flex-col gap-1">
          <TextArea
            value={anouncementDraft}
            onChange={(e) => setAnnouncementDraft(e.target.value)}
          />
          <span className="flex justify-between">
            <Button
              size="sm"
              type="reset"
              variant="secondary"
              onClick={() => {
                setIsEditing(false);
                setAnnouncementDraft(announcement.content);
              }}
            >
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Confirm
            </Button>
          </span>
        </form>
      ) : (
        <p className="flock-body pl-10 whitespace-pre-line">
          {announcement.content}
        </p>
      )}

      {comments.length > 0 && (
        <ul className="flex flex-col gap-3 border-l-2 border-accent/50 pl-4">
          {comments.map((comment) => (
            <li key={comment.id} className="flex flex-col gap-1">
              <Comment comment={comment} disableEdit={isEditing} />
            </li>
          ))}
        </ul>
      )}

      {!isEditing && <ReplyForm announcementId={announcement.id} />}
    </li>
  );
}
