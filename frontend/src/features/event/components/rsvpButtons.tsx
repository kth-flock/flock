"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaCircleCheck,
  FaCircleQuestion,
  FaCircleXmark,
  FaComment,
} from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import Button from "@/shared/components/button";
import Input from "@/shared/components/formInputs";
import { rsvpFetch } from "@/shared/lib/api";
import type { Rsvp } from "../lib/types";

const options: {
  value: Rsvp;
  label: string;
  icon: React.ReactElement;
  className: string;
}[] = [
  {
    value: "ACCEPTED",
    label: "Going",
    icon: <FaCircleCheck />,
    className: "bg-success hover:bg-success-dark",
  },
  {
    value: "MAYBE",
    label: "Maybe",
    icon: <FaCircleQuestion />,
    className: "bg-warn hover:bg-warn-dark",
  },
  {
    value: "DECLINED",
    label: "Can't go",
    icon: <FaCircleXmark />,
    className: "bg-error hover:bg-error-dark",
  },
];

const unselectedStyle = "scale-90 opacity-50 hover:opacity-80";
const MAX_COMMENT_LENGTH = 200;

const errorMessage = (err: unknown) =>
  err instanceof TypeError
    ? "Couldn't reach the server. Try again."
    : err instanceof Error
      ? err.message
      : "Something went wrong";

export default function RsvpButtons({
  eventId,
  initialRsvp,
  initialComment,
}: {
  eventId: number;
  initialRsvp: Rsvp;
  initialComment: string;
}) {
  const router = useRouter();
  const [rsvp, setRsvp] = useState<Rsvp>(initialRsvp);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [comment, setComment] = useState(initialComment);
  const [savedComment, setSavedComment] = useState(initialComment);
  const [isSavingComment, setIsSavingComment] = useState(false);
  const [commentResult, setCommentResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  async function handleSelect(value: Rsvp) {
    if (isSaving || value === rsvp) return;

    const previous = rsvp;
    setRsvp(value);
    setIsSaving(true);
    setError(null);
    try {
      await rsvpFetch(eventId, { rsvp: value });
      router.refresh();
    } catch (err) {
      setRsvp(previous);
      setError(errorMessage(err));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCommentSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = comment.trim();

    setIsSavingComment(true);
    setCommentResult(null);
    try {
      await rsvpFetch(eventId, { rsvp, rsvpComment: trimmed });
      setComment(trimmed);
      setSavedComment(trimmed);
      setCommentResult({
        ok: true,
        message: trimmed ? "Comment saved" : "Comment removed",
      });
      router.refresh();
    } catch (err) {
      setCommentResult({ ok: false, message: errorMessage(err) });
    } finally {
      setIsSavingComment(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {options.map((option) => (
          <Button
            key={option.value}
            size="lg"
            icon={option.icon}
            iconPlacement="left"
            className={twMerge(
              option.className,
              rsvp !== "PENDING" && rsvp !== option.value && unselectedStyle,
            )}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      {error && (
        <p className="flock-caption text-error" role="alert">
          {error}
        </p>
      )}

      {rsvp !== "PENDING" && (
        <form
          className="flex w-full max-w-lg flex-col gap-2 md:flex-row md:items-center"
          onSubmit={handleCommentSubmit}
        >
          <Input
            id="rsvp-comment"
            icon={<FaComment />}
            aria-label="Comment for the host"
            placeholder="Add a comment for the host (optional)"
            maxLength={MAX_COMMENT_LENGTH}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            className="shrink-0 self-end md:self-auto"
            disabled={isSavingComment || comment.trim() === savedComment}
          >
            {isSavingComment ? "Saving..." : "Save"}
          </Button>
        </form>
      )}
      {commentResult && (
        <p
          className={twMerge(
            "flock-caption",
            commentResult.ok ? "text-success" : "text-error",
          )}
          role={commentResult.ok ? "status" : "alert"}
        >
          {commentResult.message}
        </p>
      )}
    </div>
  );
}
