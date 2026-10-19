"use client";

import type { ExtendedComment } from "@/shared/types/event";
import EditablePost from "./editablePost";
import { useState } from "react";
import { getErrorMessage } from "@/shared/lib/errors";
import { deleteComment, updateComment } from "../lib/api";
import { updateCommentSchema } from "@flock/shared/schemas/comment";
import type { EventId } from "@flock/shared/schemas/event";

export default function Comment({
  comment,
  eventId,
  isHost = false,
  disableEdit = false,
  onChange,
}: {
  comment: ExtendedComment;
  eventId: EventId;
  isHost?: boolean;
  disableEdit?: boolean;
  onChange: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRemove() {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteComment(eventId, comment.announcementId, comment.id);
      onChange();
    } catch (err) {
      setError(
        getErrorMessage(err, "Couldn't delete the reply. Please try again."),
      );
      setIsDeleting(false);
    }
  }

  async function handleSave(content: string) {
    setError(null);
    const updateCommentResult = updateCommentSchema.safeParse({ content });
    try {
      if (updateCommentResult.success) {
        await updateComment(
          eventId,
          comment.announcementId,
          comment.id,
          updateCommentResult.data,
        );
        onChange();
      } else {
        setError(updateCommentResult.error.issues[0].message);
      }
    } catch (err) {
      setError(
        getErrorMessage(err, "Couldn't update the reply. Please try again."),
      );
    }
  }

  return (
    <>
      <EditablePost
        author={comment.user}
        createdAt={comment.createdAt}
        content={comment.content}
        label="reply"
        disableEdit={disableEdit}
        isDeleting={isDeleting}
        canModerate={isHost}
        onSave={handleSave}
        onRemove={handleRemove}
      />
      {error && (
        <p className="flock-caption text-error!" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
