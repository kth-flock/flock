import type { EventDetails } from "./data";

const DEFAULT_DURATION_MS = 60 * 60 * 1000;

// Google Calendar wants UTC timestamps like 20260929T180000Z
const toCalendarDate = (date: Date) =>
  date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function googleCalendarUrl(event: EventDetails) {
  const start = new Date(event.startsAt);
  // Events without an end time get a one hour slot
  const end = event.endsAt
    ? new Date(event.endsAt)
    : new Date(start.getTime() + DEFAULT_DURATION_MS);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toCalendarDate(start)}/${toCalendarDate(end)}`,
  });
  if (event.description) params.set("details", event.description);
  if (event.locationName) params.set("location", event.locationName);

  return `https://calendar.google.com/calendar/render?${params}`;
}
