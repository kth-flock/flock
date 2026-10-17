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
import { BiMinus, BiPlus } from "react-icons/bi";

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
  const [showEndFields, setShowEndFields] = useState(Boolean(values.endDate));

  function toggleEndFields() {
    if (showEndFields) {
      onChange("endDate", "");
      onChange("endTime", "");
    }
    setShowEndFields(!showEndFields);
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

      <>
        <Input
          icon={<FaCalendarDay aria-hidden />}
          type="date"
          label="Start date"
          required
          value={values.startDate}
          onChange={(e) => onChange("startDate", e.target.value)}
        />

        <Input
          icon={<FaClock aria-hidden />}
          type="time"
          label="Start time"
          required
          value={values.startTime}
          onChange={(e) => onChange("startTime", e.target.value)}
        />
        {errors["startDate"] && (
          <p className="flock-ui-label text-error md:col-span-2" role="alert">
            {errors["startDate"]}
          </p>
        )}
      </>

      {showEndFields && (
        <>
          <Input
            icon={<FaCalendarDay aria-hidden />}
            type="date"
            label="End date"
            value={values.endDate}
            onChange={(e) => onChange("endDate", e.target.value)}
          />

          <Input
            icon={<FaClock aria-hidden />}
            type="time"
            label="End time"
            value={values.endTime}
            onChange={(e) => onChange("endTime", e.target.value)}
          />

          {errors["endDate"] && (
            <p className="flock-ui-label text-error md:col-span-2" role="alert">
              {errors["endDate"]}
            </p>
          )}
        </>
      )}

      <div className="md:col-span-2">
        <Button
          type="button"
          variant="tertiary"
          size="sm"
          onClick={toggleEndFields}
        >
          {showEndFields ? (
            <>
              {" "}
              <BiMinus /> <p>Remove end date</p>
            </>
          ) : (
            <>
              {" "}
              <BiPlus /> <p>Add end date</p>
            </>
          )}
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
