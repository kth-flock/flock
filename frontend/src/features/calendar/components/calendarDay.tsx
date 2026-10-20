"use client";
import { twMerge } from "tailwind-merge";
import type { CalendarEvent } from "../lib/types";
import EventPill from "./eventPill";
import { formatDate } from "@/shared/lib/dateFormat";
import DayNumber from "./dayNumber";

const MAX_LANES = 2;

type CalendarDayProps = {
  day: Date | null;
  isToday?: boolean;
  slots?: (CalendarEvent | null)[];
  isWeekStart?: boolean;
  isWeekEnd?: boolean;
  onClick: (day: Date) => void;
};

export default function CalendarDay({
  day,
  isToday = false,
  slots = [],
  isWeekStart = false,
  isWeekEnd = false,
  onClick,
}: CalendarDayProps) {
  const visible = Array.from(
    { length: Math.min(slots.length, MAX_LANES) },
    (_, i) => slots[i] ?? null,
  );
  const total = slots.filter(Boolean).length;
  const hiddenCount = total - visible.filter(Boolean).length;

  return (
    <td
      className={twMerge(
        "h-28 border align-top p-2",
        !day ? "bg-neutral/50" : "",
      )}
    >
      {day && (
        <button
          aria-label={`${formatDate(day)}, ${total} ${total === 1 ? "event" : "events"}`}
          className={twMerge(
            "flex flex-col items-stretch gap-1 w-full h-full",
            total > 0 ? "cursor-pointer" : "",
          )}
          onClick={() => onClick(day)}
          disabled={total <= 0}
        >
          <DayNumber
            day={day}
            isToday={isToday}
            className="size-7 self-start"
          />

          {visible.map((event, i) =>
            event ? (
              <EventPill
                key={event.id}
                event={event}
                day={day}
                isWeekStart={isWeekStart}
                isWeekEnd={isWeekEnd}
              />
            ) : (
              <div key={`spacer-${i}`} className="h-10 shrink-0" aria-hidden />
            ),
          )}

          {hiddenCount > 0 && (
            <span className="px-2 text-xs text-neutral-500 self-start">
              +{hiddenCount} more
            </span>
          )}
        </button>
      )}
    </td>
  );
}
