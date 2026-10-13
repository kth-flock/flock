import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/en-gb";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("en-gb");
// Formatting runs on the server, so pin the time zone instead of using the server's
dayjs.tz.setDefault("Europe/Stockholm");

type DateInput = Date | string;

const inZone = (d: DateInput) => dayjs.tz(d);

export const formatDate = (d: DateInput) => inZone(d).format("ddd D MMM YYYY");
export const formatTime = (d: DateInput) => inZone(d).format("HH:mm");
export const formatDateInput = (d: DateInput) => inZone(d).format("YYYY-MM-DD");
export const formatTimeInput = formatTime;

const formatDateTime = (d: DateInput) => `${formatDate(d)}, ${formatTime(d)}`;

const range = (
  start: DateInput,
  end: DateInput | null,
  format: (d: DateInput) => string,
) => (end ? `${format(start)} - ${format(end)}` : format(start));

export const formatTimeRange = (start: DateInput, end: DateInput | null) =>
  range(start, end, formatTime);

export function formatDateTimeRange(start: DateInput, end: DateInput | null) {
  if (!end || !inZone(start).isSame(inZone(end), "day")) {
    return range(start, end, formatDateTime);
  }
  return `${formatDateTime(start)} - ${formatTime(end)}`;
}

const RELATIVE_DAYS_AHEAD = 14;

const daysFromToday = (d: DateInput) =>
  inZone(d).startOf("day").diff(inZone(new Date()).startOf("day"), "day");

export function formatRelativeDate(d: DateInput) {
  const days = daysFromToday(d);
  if (days < 0 || days > RELATIVE_DAYS_AHEAD) return formatDate(d);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"}`;

export function getRelativeDatetime(datetime: DateInput) {
  const diffSeconds = Math.round(dayjs(datetime).diff(dayjs(), "second", true));
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSeconds > 0) {
    if (diffHours < 24) return "today";
    if (diffHours < 48) return "tomorrow";
    if (diffDays < 4) return `in ${diffDays} days`;
  }
  if (diffSeconds < 0) {
    if (diffSeconds > -60) return "just now";
    if (diffMinutes > -60)
      return `${plural(Math.abs(diffMinutes), "minute")} ago`;
    if (diffHours > -24) return `${plural(Math.abs(diffHours), "hour")} ago`;
    if (diffDays > -7) return `${plural(Math.abs(diffDays), "day")} ago`;
  }
  return formatDate(datetime);
}

export function combineDateTime(date: string, time: string): Date | null {
  if (!date || !time) return null;
  const parsed = dayjs.tz(`${date} ${time}`); // uses tz.setDefault
  return parsed.isValid() ? parsed.toDate() : null;
}
