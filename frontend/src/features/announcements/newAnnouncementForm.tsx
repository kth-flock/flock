"use client";

import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa6";
import Button from "@/shared/components/button";
import { TextArea } from "@/shared/components/formInputs";

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
  const trimmed = announcement.trim();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!trimmed) return;

    // TODO: post announcement to event
    setAnnouncement("");
    onChange();
    onClose();
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
      />
      <div className="flex w-full justify-between">
        <Button
          type="button"
          className="shrink-0"
          variant="secondary"
          size="sm"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          icon={<FaPaperPlane />}
          iconPlacement="left"
          disabled={!trimmed}
          className="shrink-0"
          size="sm"
        >
          Send update
        </Button>
      </div>
    </form>
  );
}
