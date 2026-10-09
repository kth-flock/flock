"use client";

import Announcement from "./announcement";
import NewAnnouncementForm from "./newAnnouncementForm";
import { ExtendedAnnouncment } from "@/shared/types/event";
import Button from "@/shared/components/button";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";

export default function AnnouncementList({
  announcements,
  eventId,
  isHost = false,
}: {
  announcements: ExtendedAnnouncment[];
  eventId: number;
  isHost?: boolean;
}) {
  const [isAdding, setIsAdding] = useState(false);

  const sorted = [...announcements].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

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
        />
      )}

      {sorted.length === 0 ? (
        <p className="flock-body text-foreground/60">No updates yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {sorted.map((announcement) => (
            <Announcement key={announcement.id} announcement={announcement} />
          ))}
        </ul>
      )}
    </section>
  );
}
