// features/event/components/editablePost.tsx
"use client";

import { useState } from "react";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import Button, { IconButton } from "@/shared/components/button";
import { TextArea } from "@/shared/components/formInputs";
import { useAuth } from "@/shared/auth/authContext";
import type { PublicUser } from "@/shared/types/user";
import PostMeta from "./postMeta";

export default function EditablePost({
  author,
  createdAt,
  content,
  label,
  disableEdit = false,
  isDeleting = false,
  canModerate = false,
  onSave,
  onRemove,
  onEditingChange,
}: {
  author: PublicUser;
  createdAt: string | Date;
  content: string;
  label: string;
  disableEdit?: boolean;
  isDeleting?: boolean;
  canModerate?: boolean;
  onSave: (content: string) => void;
  onRemove: () => void;
  onEditingChange?: (isEditing: boolean) => void;
}) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(content);

  function setEditing(value: boolean) {
    setIsEditing(value);
    onEditingChange?.(value);
  }

  function startEditing() {
    setDraft(content);
    setEditing(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSave(draft.trim());
    setEditing(false);
  }

  const isAuthor = user?.id === author.id;
  const isAvailable = !isEditing && !disableEdit;
  const canEdit = isAuthor && isAvailable;
  const canRemove = (isAuthor || canModerate) && isAvailable;

  return (
    <div className="flex flex-col gap-1">
      <div className="inline-flex items-center justify-between">
        <PostMeta user={author} createdAt={createdAt} />
        <span className="inline-flex">
          {canEdit && (
            <IconButton
              variant="tertiary"
              size="sm"
              aria-label={`Edit ${label}`}
              onClick={startEditing}
              disabled={isDeleting}
            >
              <FaPenToSquare aria-hidden />
            </IconButton>
          )}
          {canRemove && (
            <IconButton
              variant="tertiary"
              size="sm"
              className="text-error!"
              aria-label={`Remove ${label}`}
              onClick={onRemove}
              disabled={isDeleting}
            >
              <FaTrash aria-hidden />
            </IconButton>
          )}
        </span>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-1">
          <TextArea
            aria-label={`Edit ${label}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
          />
          <span className="flex justify-between">
            <Button
              size="sm"
              type="button"
              variant="secondary"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
            <Button size="sm" type="submit" disabled={!draft.trim()}>
              Confirm
            </Button>
          </span>
        </form>
      ) : (
        <p className="flock-body pl-10 whitespace-pre-line">{content}</p>
      )}
    </div>
  );
}
