// Formatting runs on the server, so pin the time zone instead of using the server's
const TIME_ZONE = "Europe/Stockholm";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
});

const monthYearFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  month: "short",
  year: "numeric",
});

export const formatDate = (iso: string) => dateFormatter.format(new Date(iso));
export const formatMonthYear = (iso: string) =>
  monthYearFormatter.format(new Date(iso));
export const formatTime = (iso: string) => timeFormatter.format(new Date(iso));

export function formatDateTimeRange(startsAt: string, endsAt: string | null) {
  const start = `${formatDate(startsAt)}, ${formatTime(startsAt)}`;
  if (!endsAt) return start;

  const sameDay = formatDate(startsAt) === formatDate(endsAt);
  const end = sameDay
    ? formatTime(endsAt)
    : `${formatDate(endsAt)}, ${formatTime(endsAt)}`;

  return `${start} - ${end}`;
}

export function formatTimeRange(startsAt: string, endsAt: string | null) {
  return endsAt && formatDate(startsAt) === formatDate(endsAt)
    ? `${formatTime(startsAt)} - ${formatTime(endsAt)}`
    : formatTime(startsAt);
}

const calendarDayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
});

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const RELATIVE_DAYS_AHEAD = 14;

const daysFromToday = (iso: string) =>
  Math.round(
    (Date.parse(calendarDayFormatter.format(new Date(iso))) -
      Date.parse(calendarDayFormatter.format(new Date()))) /
      MS_PER_DAY,
  );

// Relative date formatting
export function formatRelativeDate(iso: string) {
  const days = daysFromToday(iso);
  if (days < 0 || days > RELATIVE_DAYS_AHEAD) return formatDate(iso);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}
