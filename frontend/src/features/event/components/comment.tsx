"use client";

import PostMeta from "./postMeta";
import Button, { IconButton } from "@/shared/components/button";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import { useAuth } from "@/shared/auth/authContext";
import type { ExtendedComment } from "@/shared/types/event";
import { useState } from "react";
import { TextArea } from "@/shared/components/formInputs";
import { useRouter } from "next/navigation";

export default function Comment({
  comment,
  disableEdit = false,
}: {
  comment: ExtendedComment;
  disableEdit?: boolean;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [commentDraft, setCommentDraft] = useState<string>(comment.content);

  function handleRemove() {
    // TODO: delete comment
  }

  function handleSubmitEdit() {
    // TODO: validate + send to API
    setIsEditing(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="inline-flex items-center justify-between">
        <PostMeta user={comment.user} createdAt={comment.createdAt} />
        {user?.id === comment.user.id && !isEditing && !disableEdit && (
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
            value={commentDraft}
            onChange={(e) => setCommentDraft(e.target.value)}
          />
          <span className="flex justify-between">
            <Button
              size="sm"
              type="reset"
              variant="secondary"
              onClick={() => {
                setIsEditing(false);
                setCommentDraft(comment.content);
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
          {comment.content}
        </p>
      )}
    </div>
  );
}
