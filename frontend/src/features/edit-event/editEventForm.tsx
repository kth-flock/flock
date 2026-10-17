"use client";
import EventFormFields from "@/features/event/components/eventFormFields";
import type { EventFormValues } from "@/features/event/lib/eventFormTypes";
import Button from "@/shared/components/button";
import ImageUpload from "@/shared/components/imageUpload";
import { updateEventFetch } from "@/shared/lib/api";
import type { ExtendedEvent } from "@/shared/types/event";
import { formatDateInput, formatTimeInput } from "@/shared/lib/dateFormat";
import { withUploadedImage } from "@/shared/lib/image";
import { updateEventSchema } from "@flock/shared/schemas/event";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaCamera, FaPenToSquare, FaTrash } from "react-icons/fa6";
import EventImage from "@/shared/components/eventImage";
import EditableImage from "@/shared/components/editableImage";
import {
  combineDateTime,
  getFieldErrors,
} from "@/features/event/lib/eventFormFieldsUtils";
import { useToast } from "@/shared/components/toast";

export default function EditEventForm({ event }: { event: ExtendedEvent }) {
  const router = useRouter();
  const [validationError, setValidationError] = useState<
    Record<string, string>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [eventDraft, setEventDraft] = useState<EventFormValues>({
    title: event.title,
    description: event.description ?? "",
    startDate: formatDateInput(event.startsAt),
    startTime: formatTimeInput(event.startsAt),
    endDate: event.endsAt ? formatDateInput(event.endsAt) : "",
    endTime: event.endsAt ? formatTimeInput(event.endsAt) : "",
    location: {
      label: event.locationName ?? "",
      lat: event.latitude ?? undefined,
      lon: event.longitude ?? undefined,
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const [removeImage, setRemoveImage] = useState(false);

  function handleInputChange<Key extends keyof EventFormValues>(
    field: Key,
    value: EventFormValues[Key],
  ) {
    setEventDraft((prev) => ({ ...prev, [field]: value }));
  }

  function validateFields(payload: unknown) {
    const result = updateEventSchema.safeParse(payload);

    if (!result.success) {
      setValidationError(getFieldErrors(result.error.issues));
      return null;
    }

    setValidationError({});
    return result.data;
  }

  async function handleSubmitEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const startsAt = combineDateTime(
      eventDraft.startDate,
      eventDraft.startTime,
    );
    const endsAt = combineDateTime(eventDraft.endDate, eventDraft.endTime);

    const payload = validateFields({
      title: eventDraft.title,
      description: eventDraft.description || undefined,
      locationName: eventDraft.location?.label,
      latitude: eventDraft.location?.lat,
      longitude: eventDraft.location?.lon,
      startsAt: startsAt ?? undefined,
      endsAt: endsAt ?? undefined,
    });

    if (!payload) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await withUploadedImage(imageFile, (imageUrl) =>
        updateEventFetch(event.id, {
          ...payload,
          ...(imageUrl ? { imageUrl } : removeImage && { imageUrl: null }),
        }),
      );
      toast("Event updated succesfully", "success");
      router.push(`/event/${event.id}`);
    } catch (error) {
      setSubmitError(
        error instanceof TypeError
          ? "Couldn't connect to the server. Check your connection and try again."
          : error instanceof Error
            ? error.message
            : "Couldn't update the event. Please try again.",
      );
      toast("Couldn't update event, try again", "success");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-2 md:gap-4" onSubmit={handleSubmitEvent}>
      <h1 className="flock-h1 text-center">Edit Event</h1>

      <EditableImage
        className="h-40 w-full rounded-2xl md:h-56"
        imageUploadClass="border border-primary/20 bg-background text-primary hover:border-primary"
        noImage={event.imageUrl == null}
        current={
          <EventImage
            src={event.imageUrl}
            imageFailed={event.imageFailed}
            alt={`Cover image for ${event.title}`}
            fill
            sizes="(min-width: 48rem) 48rem, 100vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
        }
        label="Upload new image"
        onFileSelect={setImageFile}
        onFileRemove={() => setImageFile(null)}
        onDelete={event.imageUrl ? () => setRemoveImage(true) : undefined}
        onCancel={() => setRemoveImage(false)}
      />

      <EventFormFields
        values={eventDraft}
        errors={validationError}
        onChange={handleInputChange}
        onLocationChange={(location) => handleInputChange("location", location)}
      />
      {submitError && (
        <p className="flock-ui-label text-error" role="alert">
          {submitError}
        </p>
      )}
      <div className="w-full flex justify-between">
        <Button type="button" variant="secondary" href={`/event/${event.id}`}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
      </div>
    </form>
  );
}
