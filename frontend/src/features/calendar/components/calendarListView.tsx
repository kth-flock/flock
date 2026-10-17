import { twMerge } from "tailwind-merge";
import { EventPillDetails } from "./eventPill";
import {
  type CalendarEvent,
  type CalendarViewProps,
  WEEKDAYS,
  dayKey,
  isSameDay,
} from "../lib/utils";
import { useEffect, useRef } from "react";

function byStartTime(a: CalendarEvent, b: CalendarEvent) {
  return a.startsAt.getTime() - b.startsAt.getTime();
}

export default function CalendarMobileView({
  today,
  weeks,
  eventsByDay,
}: CalendarViewProps) {
  const targetRef = useRef<HTMLLIElement | null>(null);

  const days = weeks
    .flat()
    .filter((day): day is Date => day !== null)
    .map((day) => ({
      day,
      events: [...(eventsByDay.get(dayKey(day)) ?? [])].sort(byStartTime),
    }))
    .filter(({ events }) => events.length > 0);

  const targetKey = (
    days.find(({ day }) => isSameDay(day, today)) ??
    days.find(({ day }) => day > today) ??
    days[days.length - 1]
  )?.day;
  const targetDayKey = targetKey ? dayKey(targetKey) : null;

  useEffect(() => {
    targetRef.current?.scrollIntoView({ block: "start" });
  }, [targetDayKey]);

  if (days.length === 0) {
    return (
      <p className="py-8 text-center flock-body-serif">No events this month</p>
    );
  }

  return (
    <ol className="mt-4 flex flex-col gap-6">
      {days.map(({ day, events }) => {
        const isToday = isSameDay(day, today);
        const weekday = WEEKDAYS[(day.getDay() + 6) % 7];
        const isTarget = dayKey(day) === targetDayKey;

        return (
          <li
            key={dayKey(day)}
            ref={isTarget ? targetRef : null}
            className="flex scroll-mt-4 items-center gap-4 not-last:border-b border-neutral pb-6"
          >
            {/* Date column, same "today" circle as CalendarDay */}
            <div className="flex w-12 shrink-0 flex-col items-center">
              <span
                className={twMerge(
                  "relative flex size-10 items-center justify-center flock-h2 leading-none",
                  isToday ? "font-bold" : "",
                )}
              >
                {isToday && (
                  <span className="absolute inset-0 rounded-full bg-secondary/50" />
                )}
                <span className="relative">{day.getDate()}</span>
              </span>
              <span className="flock-caption text-(--color-text-muted)">
                {weekday}
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
        );
      })}
    </ol>
  );
}
