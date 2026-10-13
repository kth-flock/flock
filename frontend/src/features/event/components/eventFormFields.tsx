"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Button from "@/shared/components/button";
import Input from "@/shared/components/formInputs";
import { TextArea } from "@/shared/components/formInputs";
import type { EventFormValues } from "../lib/eventFormTypes";
import {
  FaCalendarDay,
  FaClock,
  FaFileLines,
  FaHeading,
} from "react-icons/fa6";

const LocationPicker = dynamic(
  () => import("@/features/location/components/mapInput"),
  {
    ssr: false,
  },
);

export default function EventFormFields({
  values,
  errors,
  onChange,
  onLocationChange,
}: {
  values: EventFormValues;
  errors: Record<string, string>;
  onChange: <Key extends keyof EventFormValues>(
    field: Key,
    value: EventFormValues[Key],
  ) => void;
  onLocationChange: (location: EventFormValues["location"]) => void;
}) {
  const [showEnd, setShowEnd] = useState(Boolean(values.endDate));

  function toggleEnd() {
    if (showEnd) {
      // closing removes the end date so it isn't submitted by accident
      onChange("endDate", "");
      onChange("endTime", "");
    }
    setShowEnd(!showEnd);
  }

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 gap-2">
      <Input
        icon={<FaHeading aria-hidden />}
        type="text"
        label="Event title"
        required
        placeholder="Title"
        value={values.title}
        onChange={(e) => onChange("title", e.target.value)}
        error={errors["title"] ?? ""}
      />

      <LocationPicker
        initialValue={values.location}
        onSelect={onLocationChange}
      />

      <Input
        icon={<FaCalendarDay aria-hidden />}
        type="date"
        label="Start date"
        required
        value={values.startDate}
        onChange={(e) => onChange("startDate", e.target.value)}
        error={errors["startDate"] ?? ""}
      />

      <Input
        icon={<FaClock aria-hidden />}
        type="time"
        label="Start time"
        required
        value={values.startTime}
        onChange={(e) => onChange("startTime", e.target.value)}
        error={errors["startDate"] ?? ""}
      />

      {showEnd && (
        <>
          <Input
            icon={<FaCalendarDay aria-hidden />}
            type="date"
            label="End date"
            value={values.endDate}
            onChange={(e) => onChange("endDate", e.target.value)}
            error={errors["endDate"] ?? ""}
          />

          <Input
            icon={<FaClock aria-hidden />}
            type="time"
            label="End time"
            value={values.endTime}
            onChange={(e) => onChange("endTime", e.target.value)}
            error={errors["endDate"] ?? ""}
          />
        </>
      )}

      <div className="md:col-span-2">
        <Button type="button" variant="tertiary" size="sm" onClick={toggleEnd}>
          {showEnd ? "Remove end date" : "Add end date"}
        </Button>
      </div>

      <div className="md:col-span-2">
        <TextArea
          icon={<FaFileLines aria-hidden />}
          value={values.description}
          onChange={(e) => onChange("description", e.target.value)}
          label="Description"
        />
      </div>
    </div>
  );
}
