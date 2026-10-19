"use client";

import { useState } from "react";
import CalendarDay from "./calendarDay";
import CalendarDayModal from "./calendarDayModal";
import { WEEKDAYS, dayKey, isSameDay, assignLanes } from "../lib/utils";
import type { CalendarEvent, CalendarViewProps } from "../lib/types";

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
          {weeks.map((week, weekIndex) => {
            const weekEvents = new Map<string, CalendarEvent>();
            for (const day of week) {
              if (!day) continue;
              for (const e of eventsByDay.get(dayKey(day)) ?? [])
                weekEvents.set(String(e.id), e);
            }
            const lanes = assignLanes(week, [...weekEvents.values()]);

            return (
              <tr key={weekIndex}>
                {week.map((day, dayIndex) => (
                  <CalendarDay
                    key={day ? dayKey(day) : `empty-${dayIndex}`}
                    day={day}
                    isToday={day !== null && isSameDay(day, today)}
                    slots={lanes[dayIndex]}
                    isWeekStart={dayIndex === 0 || week[dayIndex - 1] === null}
                    isWeekEnd={
                      dayIndex === week.length - 1 ||
                      week[dayIndex + 1] === null
                    }
                    onClick={setOpenDay}
                  />
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
