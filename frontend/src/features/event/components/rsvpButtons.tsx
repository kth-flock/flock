"use client";

import { useState } from "react";
import type { Rsvp } from "../lib/types";
import RsvpChoice from "./rsvpChoice";
import RsvpCommentForm from "./rsvpCommentForm";

export default function RsvpButtons({
  eventId,
  initialRsvp,
  initialComment,
  onChange,
}: {
  eventId: number;
  initialRsvp: Rsvp;
  initialComment: string;
  onChange: () => void;
}) {
  const [rsvp, setRsvp] = useState<Rsvp>(initialRsvp);

  return (
    <div className="flex flex-col items-center gap-2">
      <RsvpChoice
        eventId={eventId}
        rsvp={rsvp}
        onRsvpChange={setRsvp}
        onChange={onChange}
      />
      {rsvp !== "PENDING" && (
        <RsvpCommentForm
          eventId={eventId}
          rsvp={rsvp}
          initialComment={initialComment}
          onChange={onChange}
        />
      )}
    </div>
  );
}
