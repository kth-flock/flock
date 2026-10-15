"use client";
import { twMerge } from "tailwind-merge";
import type { CalendarEvent } from "./calendarView";
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
              "self-start",
              isSameDay ? "font-bold relative" : "",
            )}
          >
            <span className="relative z-10">{day.getDate()}</span>
            {isSameDay && (
              <span className="absolute inset-0 h-full scale-120 bg-secondary/50 z-0 rounded-full aspect-square" />
            )}
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
