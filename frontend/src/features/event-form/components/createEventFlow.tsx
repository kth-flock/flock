"use client";

import { useState } from "react";
import InviteFriends from "./inviteFriends";
import EventForm from "@/features/event-form/components/eventForm";
import { createEventSchema } from "@flock/shared/schemas/event";
import { createEvent } from "../lib/api";
import { withUploadedImage } from "@/features/images/lib/image";
import { emptyEventFormValues } from "@/features/event-form/lib/formValueFormat";

export default function CreateEventFlow() {
  const [eventId, setEventId] = useState<number | null>(null);

  return (
    <>
      <h1 className="flock-h1 text-center">
        {eventId === null ? "Create Event" : "Invite friends"}
      </h1>

      {eventId === null ? (
        <EventForm
          submitLabel="Create"
          cancelHref="/"
          initialValues={emptyEventFormValues}
          mode="create"
          schema={createEventSchema}
          fallbackError="Couldn't create the event. Please try again."
          successMessage="Event created."
          onSubmit={async (payload, imageFile) => {
            const created = await withUploadedImage(imageFile, (imageUrl) =>
              createEvent({ ...payload, imageUrl }),
            );
            setEventId(created.id);
          }}
        />
      ) : (
        <InviteFriends eventId={eventId} />
      )}
    </>
  );
}
