"use client";

import { useState } from "react";
import CalendarDay from "./calendarDay";
import CalendarDayModal from "./calendarDayModal";
import {
  type CalendarEvent,
  type CalendarViewProps,
  WEEKDAYS,
  dayKey,
  isSameDay,
} from "../lib/utils";

export default function CalendarDesktopView({
  today,
  weeks,
  eventsByDay,
}: CalendarViewProps) {
  const [openDay, setOpenDay] = useState<{
    day: Date;
    events: CalendarEvent[];
  } | null>(null);

  return (
    <>
      {openDay && (
        <CalendarDayModal
          isOpen
          onClose={() => setOpenDay(null)}
          day={openDay.day}
          events={openDay.events}
        />
      )}

      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            {WEEKDAYS.map((weekday) => (
              <th key={weekday} className="p-2 text-center flock-body-serif">
                {weekday}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day, dayIndex) => {
                const dayEvents = day
                  ? (eventsByDay.get(dayKey(day)) ?? [])
                  : [];
                return (
                  <CalendarDay
                    key={dayIndex}
                    day={day}
                    isSameDay={day ? isSameDay(day, today) : false}
                    events={dayEvents}
                    onClick={(day, events) => setOpenDay({ day, events })}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
