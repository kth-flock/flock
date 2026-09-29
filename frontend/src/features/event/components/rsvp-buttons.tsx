"use client";
import { useState } from "react";
import {
  FaCircleCheck,
  FaCircleQuestion,
  FaCircleXmark,
} from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import Button from "@/components/button";

type RsvpResponse = "going" | "maybe" | "notGoing";

const options: {
  value: RsvpResponse;
  label: string;
  icon: React.ReactElement;
  className: string;
}[] = [
  {
    value: "going",
    label: "Going",
    icon: <FaCircleCheck />,
    className: "bg-success hover:bg-success-dark",
  },
  {
    value: "maybe",
    label: "Maybe",
    icon: <FaCircleQuestion />,
    className: "bg-warn hover:bg-warn-dark",
  },
  {
    value: "notGoing",
    label: "Can’t go",
    icon: <FaCircleXmark />,
    className: "bg-error hover:bg-error-dark",
  },
];

const unselectedStyle = "scale-90 opacity-50 hover:opacity-80";

// TODO: hook up to RSVP endpoint and load the user's current response
export default function RsvpButtons() {
  const [response, setResponse] = useState<RsvpResponse | null>(null);

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
            response && response !== option.value && unselectedStyle,
          )}
          onClick={() => setResponse(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
