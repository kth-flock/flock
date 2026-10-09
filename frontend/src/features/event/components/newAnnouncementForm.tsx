import { useState } from "react";
import { TextArea } from "@/shared/components/formInputs";
import Button from "@/shared/components/button";
import { FaPaperPlane } from "react-icons/fa6";

type NewAnnouncementFormProps = {
  eventId: number;
  onClose: () => void;
};

export default function NewAnnouncementForm({
  eventId,
  onClose,
}: NewAnnouncementFormProps) {
  const [announcement, setAnnouncement] = useState("");
  const inputId = `announcement-${eventId}`;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!announcement.trim()) return;

    // TODO: post announcement to event
    setAnnouncement("");
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
      <TextArea
        id={inputId}
        aria-label="New announcement"
        placeholder="Write an update..."
        value={announcement}
        onChange={(e) => setAnnouncement(e.target.value)}
        className="-my-2"
      />
      <div className="w-full flex justify-between">
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
          disabled={!announcement.trim()}
          className="shrink-0"
          size="sm"
        >
          Send update
        </Button>
      </div>
    </form>
  );
}
