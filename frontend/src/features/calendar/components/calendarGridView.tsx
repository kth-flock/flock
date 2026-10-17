"use client";

import { useState } from "react";
import CalendarDay from "./calendarDay";
import CalendarDayModal from "./calendarDayModal";
import { WEEKDAYS, dayKey, isSameDay } from "../lib/utils";
import type { CalendarViewProps } from "../lib/types";

export default function CalendarGridView({
  today,
  weeks,
  eventsByDay,
}: CalendarViewProps) {
  const [openDay, setOpenDay] = useState<Date | null>(null);

  return (
    <>
      {openDay && (
        <CalendarDayModal
          isOpen
          onClose={() => setOpenDay(null)}
          day={openDay}
          events={eventsByDay.get(dayKey(openDay)) ?? []}
        />
      )}

      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            {WEEKDAYS.map((weekday) => (
              <th
                scope="col"
                key={weekday}
                className="p-2 text-center flock-body-serif"
              >
                {weekday}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day, dayIndex) => (
                <CalendarDay
                  key={day ? dayKey(day) : `empty-${dayIndex}`}
                  day={day}
                  isToday={day !== null && isSameDay(day, today)}
                  events={day ? (eventsByDay.get(dayKey(day)) ?? []) : []}
                  onClick={setOpenDay}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
