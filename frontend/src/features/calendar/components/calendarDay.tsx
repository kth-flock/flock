"use client";
import { twMerge } from "tailwind-merge";
import type { CalendarEvent } from "../lib/types";
import EventPill from "./eventPill";
import { formatDate } from "@/shared/lib/dateFormat";
import DayNumber from "./dayNumber";

const MAX_PILLS_PER_DAY = 2;

type CalendarDayProps = {
  day: Date | null;
  isToday?: boolean;
  events?: CalendarEvent[];
  onClick: (day: Date) => void;
};

export default function CalendarDay({
  day,
  isToday = false,
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
          aria-label={`${formatDate(day)}, ${events.length} ${events.length === 1 ? "event" : "events"}`}
          className={twMerge(
            "flex flex-col items-start gap-1 w-full h-full",
            events.length > 0 ? "cursor-pointer" : "",
          )}
          onClick={() => onClick(day)}
          disabled={events.length <= 0}
        >
          <DayNumber day={day} isToday={isToday} className="size-7" />

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
