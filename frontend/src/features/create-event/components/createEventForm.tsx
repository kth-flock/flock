"use client";
import ImageUpload from "@/shared/components/imageUpload";
import Button from "@/shared/components/button";
import { useState } from "react";
import { createEventSchema } from "@flock/shared/schemas/event";
import { createEventFetch, deleteImageFromS3Fetch } from "@/shared/lib/api";
import type { EventFormValues } from "@/features/event/lib/eventFormTypes";
import EventFormFields from "@/features/event-form/components/eventFormFields";

import { FaCamera } from "react-icons/fa6";
import { withUploadedImage } from "@/shared/lib/image";
import { useToast } from "@/shared/components/toast";
import {
  combineDateTime,
  getFieldErrors,
} from "@/features/event/lib/eventFormFieldsUtils";

export default function CreateEventForm({
  onCreated,
}: {
  onCreated: (id: number) => void;
}) {
  const [validationError, setValidationError] = useState<
    Record<string, string>
  >({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(true);
  const toast = useToast();
  const [eventDraft, setEventDraft] = useState<EventFormValues>({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: null,
  });

  function handleInputChange<Key extends keyof EventFormValues>(
    field: Key,
    value: EventFormValues[Key],
  ) {
    setEventDraft((prev) => ({ ...prev, [field]: value }));
  }

  function validateFields(payload: unknown) {
    const result = createEventSchema.safeParse(payload);

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
      const createdEvent = await withUploadedImage(imageFile, (imageUrl) =>
        createEventFetch({
          ...payload,
          imageUrl,
        }),
      );
      onCreated(createdEvent.id);
      toast("Successfully created event!", "success");
    } catch (error) {
      setSubmitError(
        error instanceof TypeError
          ? "Couldn't connect to the server. Check your connection and try again."
          : error instanceof Error
            ? error.message
            : "Couldn't create the event. Please try again.",
      );
      toast("Couldn't create event, try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-2 md:gap-4" onSubmit={handleSubmitEvent}>
      <ImageUpload
        onFileSelect={setImageFile}
        onFileRemove={() => setImageFile(null)}
        className="rounded-2xl border border-primary/20 bg-background py-16 px-6 text-primary flock-h4"
      >
        <span className="flex items-center gap-4">
          <FaCamera size={40} aria-hidden="true" />
          <span>Upload</span>
        </span>
      </ImageUpload>
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
        <Button type="button" variant="secondary" href="/">
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
}
