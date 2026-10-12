"use client";

import dynamic from "next/dynamic";
import Input from "@/shared/components/formInputs";
import { TextArea } from "@/shared/components/formInputs";
import type { EventFormValues } from "../lib/eventFormTypes";
import {
  FaCalendarDay,
  FaClock,
  FaFileLines,
  FaHeading,
} from "react-icons/fa6";

const LocationPicker = dynamic(() => import("@/shared/components/mapInput"), {
  ssr: false,
});

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
  return (
    <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-2">
      <div className="lg:col-span-2">
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
      </div>

      <div className="lg:col-span-2">
        <LocationPicker
          initialValue={values.location}
          onSelect={onLocationChange}
        />
      </div>

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

      <div className="md:col-span-2 lg:col-span-4">
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
