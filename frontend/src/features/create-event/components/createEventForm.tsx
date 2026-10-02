"use client";
import ImageUpload from "@/shared/components/imageUpload";
import Input from "@/shared/components/formInputs";
import { TextArea } from "@/shared/components/formInputs";
import Button from "@/shared/components/button";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { CreateEventDraft } from "../types/eventTypes";
import { createEventSchema } from "@flock/shared/schemas/event";
const LocationPicker = dynamic(() => import("@/shared/components/mapInput"), {
  ssr: false,
});
import { createEventFetch } from "@/shared/lib/apiFetch";

import {
  FaHeading,
  FaCalendarDay,
  FaClock,
  FaFileLines,
} from "react-icons/fa6";

// TODO: make enddate optional

// TODO: Wire up image-upload

export default function CreateEventForm({
  onCreated,
}: {
  onCreated: (id: number) => void;
}) {
  const [validationError, setValidationError] = useState<
    Record<string, string>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [eventDraft, setEventDraft] = useState<CreateEventDraft>({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: null,
  });

  function handleInputChange<Key extends keyof CreateEventDraft>(
    field: Key,
    value: CreateEventDraft[Key],
  ) {
    setEventDraft((prev) => ({ ...prev, [field]: value }));
  }

  function validateFields(payload: unknown) {
    const result = createEventSchema.safeParse(payload);

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
      createdById: 1, // user ID should be connected in backend
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
      const createdEvent = await createEventFetch(payload);
      onCreated(createdEvent.id);
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
      <span className="flex flex-1 max-sm:flex-wrap gap-2">
        <Input
          icon={<FaHeading aria-hidden />}
          type="text"
          label="Event title"
          required
          placeholder="Title"
          value={eventDraft.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          error={validationError["title"] ?? ""}
        />
        <LocationPicker
          onSelect={(loc) => handleInputChange("location", loc)}
        />
      </span>
      <span className="flex flex-wrap gap-2">
        <span className="flex flex-1 max-sm:flex-wrap gap-2">
          <Input
            icon={<FaCalendarDay aria-hidden />}
            type="date"
            label="Startdate"
            required
            value={eventDraft.startDate}
            onChange={(e) => {
              const startDate = e.target.value;

              setEventDraft((prev) => ({
                ...prev,
                startDate,
              }));
            }}
            error={validationError["startDate"] ?? ""}
          />

          <Input
            icon={<FaClock aria-hidden />}
            type="time"
            label="Starttime"
            required
            value={eventDraft.startTime}
            onChange={(e) => {
              const startTime = e.target.value;

              setEventDraft((prev) => ({
                ...prev,
                startTime,
              }));
            }}
            error={validationError["startDate"] ?? ""}
          />
        </span>
        <span className="flex flex-1 max-sm:flex-wrap gap-2">
          <Input
            icon={<FaCalendarDay aria-hidden />}
            type="date"
            label="Enddate"
            value={eventDraft.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            error={validationError["endDate"] ?? ""}
          />
          <Input
            icon={<FaClock aria-hidden />}
            type="time"
            label="Endtime"
            value={eventDraft.endTime}
            onChange={(e) => handleInputChange("endTime", e.target.value)}
            error={validationError["endDate"] ?? ""}
          />
        </span>
      </span>
      <TextArea
        icon={<FaFileLines aria-hidden />}
        value={eventDraft.description}
        onChange={(e) => handleInputChange("description", e.target.value)}
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
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
}
