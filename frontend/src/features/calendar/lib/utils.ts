import type { CalendarEvent } from "./types";

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
    const key = dayKey(event.startsAt);
    map.set(key, [...(map.get(key) ?? []), event]);
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
