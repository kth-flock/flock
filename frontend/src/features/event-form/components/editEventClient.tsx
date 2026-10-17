"use client";
import { notFound } from "next/navigation";
import DeleteEvent from "@/features/event-form/components/deleteEvent";
import { useAuth } from "@/shared/auth/authContext";
import { useEvent } from "@/shared/hooks/useEvent";
import { updateEventFetch } from "@/shared/lib/api";
import { withUploadedImage } from "@/shared/lib/image";
import { updateEventSchema } from "@flock/shared/schemas/event";
import { useRouter } from "next/navigation";
import EventForm from "./eventForm";
import { eventToFormValues } from "../lib/formValueFormat";

export default function EditEventClient({ eventId }: { eventId: number }) {
  const { user } = useAuth();
  const { event, isLoading, error } = useEvent(eventId);
  const router = useRouter();

  // TODO: Add loading and error
  if (user === undefined || isLoading) return;
  if (error) return;
  if (!user || !event) notFound();
  if (event.createdById !== user.id) notFound();

  return (
    <>
      <EventForm
        heading="Edit Event"
        submitLabel="Update"
        cancelHref={`/event/${event.id}`}
        initialValues={eventToFormValues(event)}
        currentImageUrl={event.imageUrl}
        schema={updateEventSchema}
        fallbackError="Couldn't update the event. Please try again."
        onSubmit={async (payload, imageFile) => {
          await withUploadedImage(imageFile, (imageUrl) =>
            updateEventFetch(event.id, {
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
