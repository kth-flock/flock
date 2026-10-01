"use client";
import { useState } from "react";
import {
  FaCircleCheck,
  FaCircleQuestion,
  FaCircleXmark,
} from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import Button from "@/shared/components/button";
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
    label: "Can’t go",
    icon: <FaCircleXmark />,
    className: "bg-error hover:bg-error-dark",
  },
];

const unselectedStyle = "scale-90 opacity-50 hover:opacity-80";

// TODO: pass the viewer's current RSVP once GET /events/:eventId returns it
export default function RsvpButtons({
  initialRsvp = "PENDING",
}: {
  initialRsvp?: Rsvp;
}) {
  const [rsvp, setRsvp] = useState<Rsvp>(initialRsvp);

  function handleSelect(value: Rsvp) {
    setRsvp(value);
    // TODO: send to the RSVP endpoint once it exists (add an eventId prop),
    // e.g. PATCH /me/events/:eventId/rsvp { rsvp: value }, and roll back on failure
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
      {options.map((option) => (
        <Button
          key={option.value}
          size="lg"
          icon={option.icon}
          iconPlacement="left"
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
  );
}
