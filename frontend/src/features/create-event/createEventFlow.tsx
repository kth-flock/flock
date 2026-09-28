"use client";

import { useState } from "react";
import CreateEventForm from "./createEventForm";
import InviteFriends from "./inviteFriends";

export default function CreateEventFlow() {
  const [eventId, setEventId] = useState<number | null>(null);

  return (
    <>
      <h1 className="h1 text-center">
        {eventId === null ? "Create Event" : "Invite friends"}
      </h1>

      {eventId === null ? (
        <CreateEventForm onCreated={setEventId} />
      ) : (
        <InviteFriends eventId={eventId} />
      )}
    </>
  );
}
