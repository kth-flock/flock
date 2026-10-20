import type { CalendarEvent } from "./types";
import {
  formatTime,
  formatShortDate,
  isMultiDay,
} from "@/shared/lib/dateFormat";

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const MONTHS = [
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
export const EventDetailStyles = {
  PENDING: "border border-primary hover:bg-primary/10",
  ACCEPTED: "bg-primary/15 text-primary hover:bg-primary/25",
  MAYBE: "bg-warn/15 hover:bg-warn/25",
  DECLINED: "bg-error/15 text-text-muted hover:bg-error/25",
  HOST: "bg-info/15 hover:bg-info/25",
};

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function groupEventsByDay(events: CalendarEvent[]) {
  const map = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const firstDay = new Date(
      event.startsAt.getFullYear(),
      event.startsAt.getMonth(),
      event.startsAt.getDate(),
    );
    const lastDate =
      event.endsAt && event.endsAt > event.startsAt
        ? event.endsAt
        : event.startsAt;
    const lastDay = new Date(
      lastDate.getFullYear(),
      lastDate.getMonth(),
      lastDate.getDate(),
    );

    for (
      let day = firstDay;
      day <= lastDay;
      day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)
    ) {
      const key = dayKey(day);
      map.set(key, [...(map.get(key) ?? []), event]);
    }
  }
  for (const dayEvents of map.values()) {
    dayEvents.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  }
  return map;
}

export function getMonthWeeks(year: number, month: number): (Date | null)[][] {
  const leadingBlanks = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array<null>(leadingBlanks).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1),
    ),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function getDaysWithEvents(
  weeks: (Date | null)[][],
  eventsByDay: Map<string, CalendarEvent[]>,
) {
  return weeks
    .flat()
    .filter((day): day is Date => day !== null)
    .map((day) => ({ day, events: eventsByDay.get(dayKey(day)) ?? [] }))
    .filter(({ events }) => events.length > 0);
}

// Today if it has events, otherwise the next day with events, otherwise the first
export function getScrollTargetKey(days: { day: Date }[], today: Date) {
  const target =
    days.find(({ day }) => isSameDay(day, today)) ??
    days.find(({ day }) => day > today) ??
    days[0];
  return target ? dayKey(target.day) : null;
}

const dayMs = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/* lanes[dayIndex][laneIndex] = event | null. An event keeps one lane for the whole week. */
export function assignLanes(
  week: (Date | null)[],
  events: CalendarEvent[],
): (CalendarEvent | null)[][] {
  const lanes: (CalendarEvent | null)[][] = week.map(() => []);
  const dayKeys = week.map((d) => (d ? dayMs(d) : null));

  const spans = events
    .map((e) => {
      const s = dayMs(e.startsAt);
      const en = e.endsAt ? Math.max(s, dayMs(e.endsAt)) : s;
      return { e, s, en };
    })
    // longest first so multi-day events get the top lanes
    .sort((a, b) => b.en - b.s - (a.en - a.s) || a.s - b.s);

  for (const { e, s, en } of spans) {
    const covered = dayKeys.flatMap((k, i) =>
      k !== null && k >= s && k <= en ? [i] : [],
    );
    if (covered.length === 0) continue;

    let lane = 0;
    while (covered.some((i) => lanes[i][lane])) lane++;

    for (const i of covered) {
      for (let l = lanes[i].length; l < lane; l++) lanes[i][l] = null;
      lanes[i][lane] = e;
    }
  }
  return lanes;
}

export function getDayInfo(event: CalendarEvent, day: Date) {
  return {
    startsToday: isSameDay(event.startsAt, day),
    endsToday: event.endsAt ? isSameDay(event.endsAt, day) : true,
    isMultiDay: isMultiDay(event.startsAt, event.endsAt),
  };
}

export function getTimeLabels(
  event: CalendarEvent,
  { startsToday, endsToday }: { startsToday: boolean; endsToday: boolean },
) {
  const { startsAt, endsAt } = event;

  if (!startsToday && !endsToday) return { main: "All day" };

  if (startsToday) {
    return {
      main: formatTime(startsAt),
      sub: endsAt
        ? endsToday
          ? formatTime(endsAt)
          : formatShortDate(endsAt)
        : undefined,
    };
  }

  // Ends today, started on an earlier day
  return {
    main: formatShortDate(startsAt),
    sub: endsAt ? formatTime(endsAt) : undefined,
  };
}
