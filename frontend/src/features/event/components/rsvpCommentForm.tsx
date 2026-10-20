"use client";

import { useState } from "react";
import { FaComment, FaTrash } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import Button, { IconButton } from "@/shared/components/button";
import Input from "@/shared/components/formInputs";
import { updateRsvp } from "@/shared/lib/api";
import { getErrorMessage } from "@/shared/lib/errors";
import type { Rsvp } from "../lib/types";
import { error } from "console";
import { useToast } from "@/shared/components/toast";

const MAX_COMMENT_LENGTH = 200;

export default function RsvpCommentForm({
  eventId,
  rsvp,
  initialComment,
  onChange,
}: {
  eventId: number;
  rsvp: Rsvp;
  initialComment: string;
  onChange: () => void;
}) {
  const [comment, setComment] = useState(initialComment);
  const [savedComment, setSavedComment] = useState(initialComment);
  const [isSaving, setIsSaving] = useState(false);

  const toast = useToast();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = comment.trim();
    save(trimmed, trimmed ? "Comment saved" : "Comment removed");
  }

  async function save(trimmed: string, toastMessage: string) {
    setIsSaving(true);
    try {
      await updateRsvp(eventId, { rsvp, rsvpComment: trimmed || null });
      setComment(trimmed);
      setSavedComment(trimmed);
      onChange();
      toast(toastMessage, "success");
    } catch (err) {
      toast("Couldn't save the comment. Try again.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <form
        className="relative flex w-full max-w-lg items-center"
        onSubmit={handleSubmit}
      >
        <Input
          id="rsvp-comment"
          icon={<FaComment />}
          aria-label="Comment for the host"
          placeholder="Add a comment for the host (optional)"
          maxLength={MAX_COMMENT_LENGTH}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />

        {comment.trim() !== savedComment && (
          <>
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              onClick={() => setComment(savedComment)}
              disabled={isSaving || comment.trim() === savedComment}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              isLoading={isSaving}
              disabled={isSaving || comment.trim() === savedComment}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </>
        )}
        {savedComment && comment.trim() === savedComment && (
          <IconButton
            type="button"
            variant="tertiary"
            className="text-error"
            disabled={isSaving}
            onClick={() => save("", "Comment removed")}
          >
            <FaTrash aria-hidden />
          </IconButton>
        )}
      </form>
      {savedComment && comment.trim() !== savedComment && (
        <p className={"flock-caption text-error!"} role={"alert"}>
          This will replace your previous rsvp comment
        </p>
      )}
    </>
  );
}
