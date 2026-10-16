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
import { FaCamera, FaPenToSquare } from "react-icons/fa6";
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
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

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
          ...(imageUrl && { imageUrl }),
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

      {isEditingImage ? (
        <div className="flex w-full flex-col gap-2">
          <ImageUpload
            onFileSelect={setImageFile}
            onFileRemove={() => setImageFile(null)}
            className="rounded-2xl h-40 md:h-56 border border-primary/20 bg-white py-16 px-6 text-primary flock-h4 hover:border-primary"
          >
            <span className="flex items-center gap-4">
              <FaCamera size={40} aria-hidden="true" />
              <span>Upload new image</span>
            </span>
          </ImageUpload>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="self-center hover:bg-primary-light"
            onClick={() => setIsEditingImage(false)}
          >
            Cancel image editing
          </Button>
        </div>
      ) : (
        <div className="relative h-40 overflow-hidden rounded-2xl shadow-lg md:h-56">
          <Image
            src={event.imageUrl ?? "/placeholder.png"}
            alt=""
            fill
            sizes="(min-width: 48rem) 48rem, 100vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />

          <Button
            type="button"
            variant="tertiary"
            onClick={() => setIsEditingImage(true)}
            aria-label="Change image"
            className="absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-2xl bg-black/20 cursor-pointer"
          >
            <span className="flex items-center rounded-full p-4 bg-white/60 shadow-lg transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:inset-shadow-sm active:shadow-none">
              <FaPenToSquare
                size={40}
                aria-hidden="true"
                className="text-primary"
              />
            </span>
          </Button>
        </div>
      )}

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
          {isSubmitting ? "Updating event" : "Update"}
        </Button>
      </div>
    </form>
  );
}
