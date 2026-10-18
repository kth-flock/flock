"use client";

import type { ExtendedComment } from "@/shared/types/event";
import EditablePost from "./editablePost";

export default function Comment({
  comment,
  disableEdit = false,
  onChange,
}: {
  comment: ExtendedComment;
  disableEdit?: boolean;
  onChange: () => void;
}) {
  function handleRemove() {
    // TODO: delete comment
  }

  function handleSave(content: string) {
    // TODO: validate + send to API
    onChange();
  }

  return (
    <EditablePost
      author={comment.user}
      createdAt={comment.createdAt}
      content={comment.content}
      label="reply"
      disableEdit={disableEdit}
      onSave={handleSave}
      onRemove={handleRemove}
    />
  );
}
