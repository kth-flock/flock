"use client";

import { useState } from "react";
import { FaComment } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import Button from "@/shared/components/button";
import Input from "@/shared/components/formInputs";
import { updateRsvp } from "@/shared/lib/api";
import { getErrorMessage } from "@/shared/lib/errors";
import type { Rsvp } from "../lib/types";

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
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = comment.trim();

    setIsSaving(true);
    setResult(null);
    try {
      await updateRsvp(eventId, { rsvp, rsvpComment: trimmed });
      setComment(trimmed);
      setSavedComment(trimmed);
      setResult({
        ok: true,
        message: trimmed ? "Comment saved" : "Comment removed",
      });
      onChange();
    } catch (err) {
      setResult({
        ok: false,
        message: getErrorMessage(err, "Couldn't save the comment. Try again."),
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <form
        className="relative flex w-full max-w-lg flex-col gap-2"
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
            setResult(null);
          }}
        />
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          className="self-end md:absolute md:left-full md:top-1/2 md:ml-2 md:-translate-y-1/2"
          disabled={isSaving || comment.trim() === savedComment}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </form>
      {result && (
        <p
          className={twMerge(
            "flock-caption",
            result.ok ? "text-success" : "text-error",
          )}
          role={result.ok ? "status" : "alert"}
        >
          {result.message}
        </p>
      )}
    </>
  );
}
