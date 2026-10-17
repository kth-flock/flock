// Formatting runs on the server, so pin the time zone instead of using the server's
// TODO: check how server saves time in regards to timezone etc. Convert to local timezone?

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

const dateInputFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const formatMonthYear = (iso: string) =>
  monthYearFormatter.format(new Date(iso));

const timeInputFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export const formatDate = (iso: Date | string) =>
  dateFormatter.format(new Date(iso));
export const formatTime = (iso: Date | string) =>
  timeFormatter.format(new Date(iso));

export function formatDateInput(date: Date | string) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const parts = Object.fromEntries(
    dateInputFormatter
      .formatToParts(dateObj)
      .map(({ type, value }) => [type, value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function formatTimeInput(date: Date | string) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const parts = Object.fromEntries(
    timeInputFormatter
      .formatToParts(dateObj)
      .map(({ type, value }) => [type, value]),
  );
  return `${parts.hour}:${parts.minute}`;
}

export function formatDateTimeRange(
  startsAt: Date | string,
  endsAt: Date | string | null,
) {
  const start = `${formatDate(startsAt)}, ${formatTime(startsAt)}`;
  if (!endsAt) return start;

  const sameDay = formatDate(startsAt) === formatDate(endsAt);
  const end = sameDay
    ? formatTime(endsAt)
    : `${formatDate(endsAt)}, ${formatTime(endsAt)}`;

  return `${start} - ${end}`;
}

const calendarDayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
});

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const RELATIVE_DAYS_AHEAD = 14;

const daysFromToday = (iso: Date | string) =>
  Math.round(
    (Date.parse(calendarDayFormatter.format(new Date(iso))) -
      Date.parse(calendarDayFormatter.format(new Date()))) /
      MS_PER_DAY,
  );

// Relative date formatting
export function formatRelativeDate(iso: Date | string) {
  const days = daysFromToday(iso);
  if (days < 0 || days > RELATIVE_DAYS_AHEAD) return formatDate(iso);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

export function formatTimeRange(
  startsAt: Date | string,
  endsAt: Date | string | null,
) {
  const start = `${formatTime(startsAt)}`;
  if (!endsAt) return start;

  return `${start} - ${formatTime(endsAt)}`;
}

export function getRelativeDatetime(datetime: Date) {
  const eventDate = new Date(datetime);
  const today = new Date();
  const diffSeconds = Math.round(
    (eventDate.getTime() - today.getTime()) / 1000,
  );
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSeconds > 0) {
    if (diffHours < 24) {
      return "today";
    }
    if (diffHours < 48) {
      return "tomorrow";
    }
    if (diffDays < 4) {
      return `in ${diffDays} days`;
    }
  }
  if (diffSeconds < 0) {
    if (diffSeconds > -60) {
      return "just now";
    }
    if (diffMinutes > -60) {
      return `${Math.abs(diffMinutes)} minute${diffMinutes !== -1 ? "s" : ""} ago`;
    }
    if (diffHours > -24) {
      return `${Math.abs(diffHours)} hour${diffHours !== -1 ? "s" : ""} ago`;
    }
    if (diffDays > -7) {
      return `${Math.abs(diffDays)} day${diffDays !== -1 ? "s" : ""} ago`;
    }
  }
  return formatDate(eventDate);
}

export function combineDateTime(date: string, time: string): Date | null {
  if (!date || !time) return null;

  const result = new Date(`${date}T${time}`);
  return Number.isNaN(result.getTime()) ? null : result;
}
