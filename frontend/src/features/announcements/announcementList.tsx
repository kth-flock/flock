"use client";

import Announcement from "./announcement";
import NewAnnouncementForm from "./newAnnouncementForm";
import { ExtendedAnnouncment } from "@/shared/types/event";
import Button from "@/shared/components/button";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { byNewest } from "@/shared/lib/sort";

export default function AnnouncementList({
  announcements,
  eventId,
  isHost = false,
  onChange,
}: {
  announcements: ExtendedAnnouncment[];
  eventId: number;
  isHost?: boolean;
  onChange: () => void;
}) {
  const [isAdding, setIsAdding] = useState(false);

  const sorted = [...announcements].sort(byNewest);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="flock-h2 text-primary">Updates</h2>
        {isHost && (
          <Button
            icon={<FaPlus />}
            iconPlacement="left"
            size="sm"
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
          >
            Add update
          </Button>
        )}
      </div>

      {isAdding && (
        <NewAnnouncementForm
          eventId={eventId}
          onClose={() => setIsAdding(false)}
          onChange={onChange}
        />
      )}

      {sorted.length === 0 ? (
        <p className="flock-body text-foreground/60">No updates yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {sorted.map((announcement) => (
            <Announcement
              key={announcement.id}
              announcement={announcement}
              onChange={onChange}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
