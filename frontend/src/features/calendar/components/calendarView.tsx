"use client";

import { useMemo, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa6";
import Button, { IconButton } from "@/shared/components/button";
import CalendarDay from "./calendarDay";
import CalendarDayModal from "./calendarDayModal";
import { getCreatedEvents, getInvitedEvents } from "../lib/api";
import { useAuth } from "@/shared/auth/authContext";
import type { RsvpStatus } from "@flock/shared/schemas/event";

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
  id: number;
  title: string;
  startsAt: Date;
  createdBy?: {
    id: number;
    firstName: string;
    lastName: string;
    imageUrl: string | null;
  };
  invitees: { rsvp: RsvpStatus }[];
};

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

// TODO: Fix different view on mobile
export default function CalendarView() {
  const { user } = useAuth();
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [openDay, setOpenDay] = useState<{
    day: Date;
    events: CalendarEvent[];
  } | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  // TODO: get RSVP status for invited events
  useEffect(() => {
    let isCurrent = true;

    async function loadEvents() {
      try {
        const [invitedEvents, createdEvents] = await Promise.all([
          getInvitedEvents(),
          getCreatedEvents(),
        ]);
        const uniqueEvents = new Map(
          [
            ...createdEvents.map((event: CalendarEvent) => ({
              ...event,
              createdBy: user,
            })),
            ...invitedEvents,
          ].map((event) => [event.id, event]),
        );

        if (isCurrent) {
          setEvents(
            [...uniqueEvents.values()].map((event) => ({
              ...event,
              startsAt: new Date(event.startsAt),
            })),
          );
        }
      } catch (error) {
        if (isCurrent) {
          setLoadError(
            error instanceof Error ? error.message : "Failed to load events",
          );
        }
      }
    }

    void loadEvents();

    return () => {
      isCurrent = false;
    };
  }, [user]);

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
        {loadError && (
          <p className="mb-4 text-error" role="alert">
            {loadError}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-8">
            <h2 className="flock-h2 w-64">
              {MONTHS[month]} {year}
            </h2>
            <div className="flex gap-2">
              {/* TODO: Fix so buttons are at the same place always */}
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
