"use client";

import Announcement from "./announcement";
import NewAnnouncementForm from "./newAnnouncementForm";
import type { ExtendedAnnouncement } from "@/shared/types/event";
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
  announcements: ExtendedAnnouncement[];
  eventId: number;
  isHost?: boolean;
  onChange: () => void;
}) {
  const [isAdding, setIsAdding] = useState(false);

  const sorted = [...announcements].sort(byNewest);

  const showNoUpdate = sorted.length === 0 && !isAdding;

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

      {showNoUpdate ? (
        <p className="flock-body text-foreground/60">No updates yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {sorted.map((announcement) => (
            <Announcement
              key={announcement.id}
              announcement={announcement}
              isHost={isHost}
              onChange={onChange}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
