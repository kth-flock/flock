"use client";

import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa6";
import Button from "@/shared/components/button";
import { TextArea } from "@/shared/components/formInputs";
import { getErrorMessage } from "@/shared/lib/errors";
import { createAnnouncement } from "../lib/api";
import { createAnnouncementSchema } from "@flock/shared/schemas/announcement";

export default function NewAnnouncementForm({
  eventId,
  onClose,
  onChange,
}: {
  eventId: number;
  onClose: () => void;
  onChange: () => void;
}) {
  const [announcement, setAnnouncement] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const result = createAnnouncementSchema.safeParse({ content: announcement });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setIsSubmitting(true);

    try {
      await createAnnouncement(eventId, result.data);
      setAnnouncement("");
      onChange();
      onClose();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Couldn't create the announcement. Please try again.",
        ),
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
      <TextArea
        id={`announcement-${eventId}`}
        aria-label="New announcement"
        placeholder="Write an update..."
        value={announcement}
        onChange={(e) => setAnnouncement(e.target.value)}
        autoFocus
        className="-my-2"
        disabled={isSubmitting}
      />
      {error && (
        <p className="flock-caption text-error!" role="alert">
          {error}
        </p>
      )}
      <div className="flex w-full justify-between">
        <Button
          type="button"
          className="shrink-0"
          variant="secondary"
          size="sm"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          icon={<FaPaperPlane />}
          iconPlacement="left"
          disabled={!announcement.trim() || isSubmitting}
          className="shrink-0"
          size="sm"
        >
          {isSubmitting ? "Sending..." : "Send update"}
        </Button>
      </div>
    </form>
  );
}
