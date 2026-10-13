import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { ExtendedEvent } from "@/shared/types/event";

dayjs.extend(utc);

const DEFAULT_DURATION_HOURS = 1;

// Google Calendar wants UTC timestamps like 20260929T180000Z
const toCalendarDate = (date: dayjs.Dayjs) =>
  date.utc().format("YYYYMMDD[T]HHmmss[Z]");

export function getGoogleCalendarUrl(event: ExtendedEvent) {
  const start = dayjs(event.startsAt);
  // Events without an end time get a one hour slot
  const end = event.endsAt
    ? dayjs(event.endsAt)
    : start.add(DEFAULT_DURATION_HOURS, "hour");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toCalendarDate(start)}/${toCalendarDate(end)}`,
  });
  if (event.description) params.set("details", event.description);
  if (event.locationName) params.set("location", event.locationName);

  return `https://calendar.google.com/calendar/render?${params}`;
}
