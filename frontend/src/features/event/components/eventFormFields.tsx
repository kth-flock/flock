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
    <>
      <span className="flex flex-1 max-sm:flex-wrap gap-2">
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
      </span>
      <span className="flex flex-wrap gap-2">
        <span className="flex flex-1 max-sm:flex-wrap gap-2">
          <Input
            icon={<FaCalendarDay aria-hidden />}
            type="date"
            label="Startdate"
            required
            value={values.startDate}
            onChange={(e) => onChange("startDate", e.target.value)}
            error={errors["startDate"] ?? ""}
          />

          <Input
            icon={<FaClock aria-hidden />}
            type="time"
            label="Starttime"
            required
            value={values.startTime}
            onChange={(e) => onChange("startTime", e.target.value)}
            error={errors["startDate"] ?? ""}
          />
        </span>
        <span className="flex flex-1 max-sm:flex-wrap gap-2">
          <Input
            icon={<FaCalendarDay aria-hidden />}
            type="date"
            label="Enddate"
            value={values.endDate}
            onChange={(e) => onChange("endDate", e.target.value)}
            error={errors["endDate"] ?? ""}
          />
          <Input
            icon={<FaClock aria-hidden />}
            type="time"
            label="Endtime"
            value={values.endTime}
            onChange={(e) => onChange("endTime", e.target.value)}
            error={errors["endDate"] ?? ""}
          />
        </span>
      </span>
      <TextArea
        icon={<FaFileLines aria-hidden />}
        value={values.description}
        onChange={(e) => onChange("description", e.target.value)}
      />
    </>
  );
}
