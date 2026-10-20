"use client";
import { useCallback, useState } from "react";
import { notFound } from "next/navigation";
import DeleteEvent from "@/features/event-form/components/deleteEvent";
import { useAuth } from "@/shared/auth/authContext";
import { useFetch } from "@/shared/hooks/useFetch";
import { getEvent } from "@/features/event/lib/api";
import { updateEvent } from "../lib/api";
import { withUploadedImage } from "@/features/images/lib/image";
import { updateEventSchemaFor } from "@flock/shared/schemas/event";
import { useRouter } from "next/navigation";
import EventForm from "./eventForm";
import { eventToFormValues } from "../lib/formValueFormat";
import EditEventSkeleton from "./editEventSkeleton";
import ErrorState from "@/shared/components/ErrorState";

export default function EditEventClient({ eventId }: { eventId: number }) {
  const { user } = useAuth();
  const fetchEvent = useCallback(() => getEvent(eventId), [eventId]);
  const { data: event, isLoading, error, errorStatus, refetch } =
    useFetch(fetchEvent);
  const router = useRouter();
  const [openedAt] = useState(Date.now);

  if (user === undefined || isLoading) return <EditEventSkeleton />;
  if (errorStatus === 404) notFound();
  if (error) {
    return (
      <ErrorState
        title="Something went wrong"
        message={error}
        action={{ label: "Try again", onClick: refetch }}
      />
    );
  }
  if (!user || !event) notFound();
  if (event.createdById !== user.id) notFound();

  return (
    <>
      <EventForm
        heading="Edit Event"
        submitLabel="Update"
        cancelHref={`/event/${event.id}`}
        initialValues={eventToFormValues(event)}
        mode="update"
        currentImageUrl={event.imageUrl}
        schema={updateEventSchemaFor(event)}
        startLocked={event.startsAt.getTime() <= openedAt}
        fallbackError="Couldn't update the event. Please try again."
        successMessage="Event updated successfully."
        onSubmit={async (payload, imageFile) => {
          await withUploadedImage(imageFile, (imageUrl) =>
            updateEvent(event.id, {
              ...payload,
              ...(imageUrl && { imageUrl }),
            }),
          );
          router.push(`/event/${event.id}`);
        }}
      />
      <DeleteEvent eventId={event.id} />
    </>
  );
}
