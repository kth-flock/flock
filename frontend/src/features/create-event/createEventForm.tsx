"use client";
import ImageUpload from "@/shared/components/imageUpload";
import Input from "@/shared/components/formInputs";
import { TextArea } from "@/shared/components/formInputs";
import Button from "@/shared/components/button";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Location } from "@/shared/lib/nominatim";

const LocationPicker = dynamic(() => import("@/shared/components/mapInput"), {
  ssr: false,
});

import {
  FaHeading,
  FaCalendarDay,
  FaClock,
  FaFileLines,
} from "react-icons/fa6";

// TODO: Validation with zod + make sure data conforms to DB structure + connect to API
// TODO: Mobile styling

type EventInfo = {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: Location | null;
};

export default function CreateEventForm({
  onCreated,
}: {
  onCreated: (id: number) => void;
}) {
  const [eventDraft, setEventDraft] = useState<EventInfo>({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: null,
  });

  useEffect(() => {
    const today = new Date();
    const localDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    setEventDraft((prev) => ({
      ...prev,
      startDate: prev.startDate || localDate,
      startTime: prev.startTime || "17:00",
    }));
  }, []);

  function handleInputChange<Key extends keyof EventInfo>(
    field: Key,
    value: EventInfo[Key],
  ) {
    setEventDraft((prev) => ({ ...prev, [field]: value }));
  }

  function combineDateTime(date: string, time: string): Date | null {
    if (!date || !time) return null;
    return new Date(`${date}T${time}`);
  }

  function handleSubmitEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const startsAt = combineDateTime(
      eventDraft.startDate,
      eventDraft.startTime,
    );
    const endsAt = combineDateTime(eventDraft.endDate, eventDraft.endTime);

    if (!startsAt) return;

    const payload = {
      title: eventDraft.title,
      description: eventDraft.description || undefined,
      locationName: eventDraft.location?.label,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt?.toISOString(),
    };

    // TODO: connect to API and return actual event ID
    console.log(payload);
    onCreated(1);
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmitEvent}>
      <ImageUpload />
      <span className="flex flex-1 max-sm:flex-wrap gap-2">
        <Input
          icon={<FaHeading />}
          type="text"
          label="Event title"
          placeholder="Title"
          value={eventDraft.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
        />
        <LocationPicker
          onSelect={(loc) => handleInputChange("location", loc)}
        />
      </span>
      <span className="flex flex-wrap gap-2">
        <span className="flex flex-1 max-sm:flex-wrap gap-2">
          <Input
            icon={<FaCalendarDay />}
            type="date"
            label="Startdate"
            value={eventDraft.startDate}
            onChange={(e) => {
              const startDate = e.target.value;

              setEventDraft((prev) => ({
                ...prev,
                startDate,
                endDate: prev.endDate || startDate,
              }));
            }}
          />
          <Input
            icon={<FaClock />}
            type="time"
            label="Starttime"
            value={eventDraft.startTime}
            onChange={(e) => {
              const startTime = e.target.value;

              setEventDraft((prev) => ({
                ...prev,
                startTime,
                endTime: prev.endTime || startTime,
              }));
            }}
          />
        </span>
        <span className="flex flex-1 max-sm:flex-wrap gap-2">
          <Input
            icon={<FaCalendarDay />}
            type="date"
            label="Enddate"
            value={eventDraft.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
          />
          <Input
            icon={<FaClock />}
            type="time"
            label="Endtime"
            value={eventDraft.endTime}
            onChange={(e) => handleInputChange("endTime", e.target.value)}
          />
        </span>
      </span>
      <TextArea
        icon={<FaFileLines />}
        value={eventDraft.description}
        onChange={(e) => handleInputChange("description", e.target.value)}
      />
      <div className="w-full flex justify-between">
        <Button type="button" variant="secondary" href="/">
          Cancel
        </Button>
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
}
