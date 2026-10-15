"use client";

import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa6";
import Button, { IconButton } from "@/shared/components/button";
import CalendarDay from "./calendarDay";
import CalendarDayModal from "./calendarDayModal";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export type CalendarEvent = {
  id: string;
  title: string;
  startsAt: Date;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    imageUrl: string | null;
  };
};

// ---- Fake data (remove once you wire up the backend) ----
function makeFakeEvents(): CalendarEvent[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const creator = {
    id: "u1",
    firstName: "Anna",
    lastName: "Lindberg",
    imageUrl: null,
  };

  const at = (day: number, hour: number, minute = 0) =>
    new Date(y, m, day, hour, minute);

  return [
    { id: "1", title: "Team lunch", startsAt: at(3, 12), createdBy: creator },
    {
      id: "2",
      title: "Board games",
      startsAt: at(8, 18, 30),
      createdBy: creator,
    },
    {
      id: "3",
      title: "Birthday party",
      startsAt: at(12, 19),
      createdBy: creator,
    },
    { id: "4", title: "Morning run", startsAt: at(12, 7), createdBy: creator },
    { id: "5", title: "Movie night", startsAt: at(12, 21), createdBy: creator },
    { id: "6", title: "Workshop", startsAt: at(18, 10), createdBy: creator },
    { id: "7", title: "Dinner", startsAt: at(25, 18), createdBy: creator },
    { id: "8", title: "Hike", startsAt: at(25, 9), createdBy: creator },
  ];
}
// ---------------------------------------------------------

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Local-time key, e.g. "2026-9-12" (don't use toISOString, it shifts to UTC)
function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function groupEventsByDay(events: CalendarEvent[]) {
  const map = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = dayKey(event.startsAt);
    const list = map.get(key) ?? [];
    list.push(event);
    map.set(key, list);
  }
  for (const list of map.values()) {
    list.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  }
  return map;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
}

function getMonthWeeks(year: number, month: number): (Date | null)[][] {
  const leadingBlanks = new Date(year, month, 0).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array<null>(leadingBlanks).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1),
    ),
  ];

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export default function CalendarView({
  events = makeFakeEvents(), // swap for real events from the backend
}: {
  events?: CalendarEvent[];
}) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [openDay, setOpenDay] = useState<{
    day: Date;
    events: CalendarEvent[];
  } | null>(null);

  const today = new Date();
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const weeks = getMonthWeeks(year, month);
  const eventsByDay = useMemo(() => groupEventsByDay(events), [events]);

  function changeMonth(offset: number) {
    setVisibleMonth(new Date(year, month + offset, 1));
  }

  return (
    <>
      {openDay && (
        <CalendarDayModal
          isOpen={!!openDay}
          onClose={() => setOpenDay(null)}
          day={openDay.day}
          events={openDay.events}
        />
      )}
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-8">
            <h2 className="flock-h2">
              {MONTHS[month]} {year}
            </h2>
            <div className="flex gap-2">
              <IconButton
                variant="secondary"
                size="sm"
                onClick={() => changeMonth(-1)}
              >
                <FaChevronLeft />
              </IconButton>
              <IconButton
                variant="secondary"
                size="sm"
                onClick={() => changeMonth(1)}
              >
                <FaChevronRight />
              </IconButton>
            </div>
          </div>
          <Button icon={<FaPlus />} iconPlacement="left" href="/create-event">
            Add
          </Button>
        </div>

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
      </div>
    </>
  );
}
