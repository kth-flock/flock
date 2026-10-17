"use client";
import { twMerge } from "tailwind-merge";
import type { CalendarEvent } from "../lib/utils";
import EventPill from "./eventPill";
import { useState } from "react";
import CalendarDayModal from "./calendarDayModal";

const MAX_PILLS_PER_DAY = 2;

type CalendarDayProps = {
  day: Date | null;
  isSameDay?: boolean;
  events?: CalendarEvent[];
  onClick: (day: Date, events: CalendarEvent[]) => void;
};

export default function CalendarDay({
  day,
  isSameDay = false,
  events = [],
  onClick,
}: CalendarDayProps) {
  const visible = events.slice(0, MAX_PILLS_PER_DAY);
  const hiddenCount = events.length - visible.length;
  return (
    <td
      className={twMerge(
        "h-28 border align-top p-2",
        !day ? "bg-neutral/50" : "",
      )}
    >
      {day && (
        <button
          className={twMerge(
            "flex flex-col items-start gap-1 w-full h-full",
            events.length > 0 ? "cursor-pointer" : "",
          )}
          onClick={() => onClick(day, events)}
          disabled={events.length <= 0}
        >
          <span
            className={twMerge(
              "relative flex size-7 shrink-0 items-center justify-center self-start leading-none",
              isSameDay ? "font-bold" : "",
            )}
          >
            {isSameDay && (
              <span className="absolute inset-0 rounded-full bg-secondary/50" />
            )}
            <span className="relative">{day.getDate()}</span>
          </span>

          {visible.map((event) => (
            <EventPill key={event.id} event={event} />
          ))}

          {hiddenCount > 0 && (
            <span className="px-2 text-xs text-neutral-500">
              +{hiddenCount} more
            </span>
          )}
        </button>
      )}
    </td>
  );
}
