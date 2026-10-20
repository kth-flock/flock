"use client";
import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa6";
import Button from "@/shared/components/button";
import Input from "@/shared/components/formInputs";
import { createComment } from "../lib/api";
import type { EventId } from "@flock/shared/schemas/event";
import type { AnnouncementId } from "@flock/shared/schemas/announcement";
import { createCommentSchema } from "@flock/shared/schemas/comment";
import { getErrorMessage } from "@/shared/lib/errors";

export default function ReplyForm({
  announcementId,
  eventId,
  onChange,
}: {
  announcementId: AnnouncementId;
  eventId: EventId;
  onChange: () => void;
}) {
  const [reply, setReply] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputId = `reply-${announcementId}`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const result = createCommentSchema.safeParse({
      content: reply,
    });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setIsSubmitting(true);
    try {
      await createComment(eventId, announcementId, result.data);
      setReply("");
      onChange();
    } catch (err) {
      setError(
        getErrorMessage(err, "Couldn't create the reply. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <Input
          id={inputId}
          aria-label="Write a reply"
          placeholder="Write a reply"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          className="-my-2"
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          icon={<FaPaperPlane />}
          iconPlacement="left"
          disabled={!reply.trim() || isSubmitting}
          className="shrink-0"
        >
          {isSubmitting ? "Sending..." : "Reply"}
        </Button>
      </div>
      {error && (
        <p className="flock-caption text-error!" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
