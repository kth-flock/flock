"use client";

import { useEffect, useMemo, useRef } from "react";
import { EventPillDetails } from "./eventPill";
import DayNumber from "./dayNumber";
import {
  WEEKDAYS,
  dayKey,
  getDaysWithEvents,
  getScrollTargetKey,
  isSameDay,
} from "../lib/utils";
import type { CalendarViewProps } from "../lib/types";

export default function CalendarListView({
  today,
  weeks,
  eventsByDay,
  isLoading,
}: CalendarViewProps & { isLoading: boolean }) {
  const targetRef = useRef<HTMLLIElement | null>(null);

  const days = useMemo(
    () => getDaysWithEvents(weeks, eventsByDay),
    [weeks, eventsByDay],
  );
  const targetKey = getScrollTargetKey(days, today);

  const hasEvents = days.length > 0;
  const monthKey = dayKey(weeks.flat().find((d) => d !== null)!);
  useEffect(() => {
    targetRef.current?.scrollIntoView({ block: "start" });
  }, [monthKey, hasEvents]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!hasEvents) {
    return isLoading ? null : (
      <p className="py-8 text-center flock-body-serif">No events this month</p>
    );
  }

  return (
    <ol className="mt-4 flex flex-col gap-6">
      {days.map(({ day, events }) => (
        <li
          key={dayKey(day)}
          ref={dayKey(day) === targetKey ? targetRef : null}
          className="flex scroll-mt-24 items-center gap-4 not-last:border-b border-neutral pb-6"
        >
          <div className="flex w-12 shrink-0 flex-col items-center">
            <DayNumber
              day={day}
              isToday={isSameDay(day, today)}
              className="size-10 flock-h2"
            />
            <span className="flock-caption text-(--color-text-muted)">
              {WEEKDAYS[(day.getDay() + 6) % 7]}
            </span>
          </div>

          <ul className="flex flex-1 flex-col gap-3 border-l pl-4">
            {events.map((event) => (
              <li key={event.id}>
                <EventPillDetails event={event} />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
