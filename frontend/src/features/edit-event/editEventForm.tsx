"use client";
import ImageUpload from "@/shared/components/imageUpload";
import Button from "@/shared/components/button";
import { useState } from "react";
import type { EventFormValues } from "@/features/event/lib/eventFormTypes";
import EventFormFields from "@/features/event/components/eventFormFields";
import { updateEventSchema } from "@flock/shared/schemas/event";
import { updateEventFetch } from "@/shared/lib/apiFetch";
import type { Event } from "@prisma/types";
import { formatDateInput, formatTimeInput } from "@/shared/lib/dateFormat";
import { useRouter } from "next/navigation";

// TODO: make enddate optional

// TODO: Wire up image-upload

export default function EditEventForm({ event }: { event: Event }) {
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
      lng: event.longitude ?? undefined,
    },
  });

  function handleInputChange<Key extends keyof EventFormValues>(
    field: Key,
    value: EventFormValues[Key],
  ) {
    setEventDraft((prev) => ({ ...prev, [field]: value }));
  }

  function validateFields(payload: unknown) {
    const result = updateEventSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors = result.error.issues.reduce<Record<string, string>>(
        (errors, issue) => {
          const field = issue.path.join(".") || "form";
          errors[field] ??= issue.message;
          return errors;
        },
        {},
      );
      setValidationError(fieldErrors);
      return null;
    }

    setValidationError({});
    return result.data;
  }

  function combineDateTime(date: string, time: string): Date | null {
    if (!date || !time) return null;
    return new Date(`${date}T${time}`);
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
      longitude: eventDraft.location?.lng,
      startsAt: startsAt ?? undefined,
      endsAt: endsAt ?? undefined,
    });

    if (!payload) return;

    setSubmitError(null);
    try {
      await updateEventFetch(event.id, payload);
      router.push(`/event/${event.id}`);
    } catch (error) {
      setSubmitError(
        error instanceof TypeError
          ? "Couldn't connect to the server. Check your connection and try again."
          : error instanceof Error
            ? error.message
            : "Couldn't create the event. Please try again.",
      );
    }
  }

  return (
    <form className="flex flex-col gap-2 md:gap-4" onSubmit={handleSubmitEvent}>
      <ImageUpload />
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
        <Button type="button" variant="secondary" href={`event/${event.id}`}>
          Cancel
        </Button>
        <Button type="submit">Update</Button>
      </div>
    </form>
  );
}
