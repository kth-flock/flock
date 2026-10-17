"use client";

import { useState } from "react";
import {
  FaCircleCheck,
  FaCircleQuestion,
  FaCircleXmark,
} from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import Button from "@/shared/components/button";
import { updateRsvp } from "@/shared/lib/api";
import { getErrorMessage } from "@/shared/lib/errors";
import type { Rsvp } from "../lib/types";

const options: {
  value: Rsvp;
  label: string;
  icon: React.ReactElement;
  className: string;
}[] = [
  {
    value: "ACCEPTED",
    label: "Going",
    icon: <FaCircleCheck />,
    className: "bg-success hover:bg-success-dark",
  },
  {
    value: "MAYBE",
    label: "Maybe",
    icon: <FaCircleQuestion />,
    className: "bg-warn hover:bg-warn-dark",
  },
  {
    value: "DECLINED",
    label: "Can't go",
    icon: <FaCircleXmark />,
    className: "bg-error hover:bg-error-dark",
  },
];

const unselectedStyle = "scale-90 opacity-50 hover:opacity-80";

export default function RsvpChoice({
  eventId,
  rsvp,
  onRsvpChange,
  onChange,
}: {
  eventId: number;
  rsvp: Rsvp;
  onRsvpChange: (rsvp: Rsvp) => void;
  onChange: () => void;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(value: Rsvp) {
    if (isSaving || value === rsvp) return;

    const previous = rsvp;
    onRsvpChange(value);
    setIsSaving(true);
    setError(null);
    try {
      await updateRsvp(eventId, { rsvp: value });
      onChange();
    } catch (err) {
      onRsvpChange(previous);
      setError(getErrorMessage(err, "Couldn't save your answer. Try again."));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {options.map((option) => (
          <Button
            key={option.value}
            size="lg"
            icon={option.icon}
            iconPlacement="left"
            aria-pressed={rsvp === option.value}
            className={twMerge(
              option.className,
              rsvp !== "PENDING" && rsvp !== option.value && unselectedStyle,
            )}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      {error && (
        <p className="flock-caption text-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
