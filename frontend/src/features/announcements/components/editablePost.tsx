"use client";

import { useState } from "react";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import Button, { IconButton } from "@/shared/components/button";
import { TextArea } from "@/shared/components/formInputs";
import { useAuth } from "@/shared/auth/authContext";
import type { PublicUser } from "@/shared/types/user";
import PostMeta from "./postMeta";
import Modal from "@/shared/components/modal";

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
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  function confirmDelete() {
    setIsConfirmingDelete(false);
    onRemove();
  }

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
              onClick={() => setIsConfirmingDelete(true)}
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
        <p className="flock-body min-w-0 pl-10 whitespace-pre-line wrap-break-word">
          {content}
        </p>
      )}
      <Modal
        isOpen={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="flock-h5">Delete this {label}?</h2>
            <p className="flock-caption">{"This can't be undone."}</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              icon={<FaTrash />}
              iconPlacement="left"
              className="bg-error text-background hover:bg-error-dark"
              onClick={confirmDelete}
            >
              Delete {label}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
