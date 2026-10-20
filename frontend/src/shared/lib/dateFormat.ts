import dayjs, { type ConfigType } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/en-gb";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.locale("en-gb");

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

const monthYearFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
});

const DATE_INPUT_FORMAT = "YYYY-MM-DD";
const TIME_INPUT_FORMAT = "HH:mm";
const DATE_TIME_INPUT_FORMAT = `${DATE_INPUT_FORMAT} ${TIME_INPUT_FORMAT}`;

const toValidDayjs = (value: ConfigType) => {
  const result = dayjs(value);

  if (!result.isValid()) {
    throw new TypeError("Invalid date");
  }

  return result;
};

const timeInputFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export const formatShortDate = (value: Date | string) =>
  shortDateFormatter.format(toValidDayjs(value).toDate());

export function formatMonthYear(value: Date | string) {
  return monthYearFormatter.format(toValidDayjs(value).toDate());
}

export function formatDate(value: Date | string) {
  return dateFormatter.format(toValidDayjs(value).toDate());
}

export function formatTime(value: Date | string) {
  return timeFormatter.format(toValidDayjs(value).toDate());
}

export function formatDateInput(value: Date | string) {
  return toValidDayjs(value).format(DATE_INPUT_FORMAT);
}

export function formatTimeInput(value: Date | string) {
  return toValidDayjs(value).format(TIME_INPUT_FORMAT);
}

export function formatTimeRange(
  startsAt: Date | string,
  endsAt: Date | string | null,
) {
  const start = formatTime(startsAt);

  return endsAt ? `${start} - ${formatTime(endsAt)}` : start;
}

export function formatDateRange(
  startsAt: Date | string,
  endsAt: Date | string,
) {
  return `${formatShortDate(startsAt)} - ${formatShortDate(endsAt)}`;
}

const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"}`;
const MAX_FUTURE_DAYS = 3;
const MAX_PAST_DAYS = 7;

export function getRelativeDatetime(value: Date | string) {
  const date = toValidDayjs(value);
  const now = dayjs();

  const diffSeconds = date.diff(now, "second");
  const diffMinutes = date.diff(now, "minute");
  const diffHours = date.diff(now, "hour");

  const calendarDays = date.startOf("day").diff(now.startOf("day"), "day");

  if (diffSeconds >= 0) {
    if (calendarDays === 0) return "today";
    if (calendarDays === 1) return "tomorrow";
    if (calendarDays <= MAX_FUTURE_DAYS) return `in ${calendarDays} days`;
  } else {
    if (diffSeconds > -60) return "just now";
    if (diffMinutes > -60) {
      return `${plural(Math.abs(diffMinutes), "minute")} ago`;
    }
    if (diffHours > -24) {
      return `${plural(Math.abs(diffHours), "hour")} ago`;
    }
    if (calendarDays < 0 && calendarDays > -MAX_PAST_DAYS) {
      return `${plural(Math.abs(calendarDays), "day")} ago`;
    }
  }

  return formatDate(value);
}

export function combineDateTime(date: string, time: string): Date | null {
  if (!date || !time) return null;

  const parsed = dayjs(`${date} ${time}`, DATE_TIME_INPUT_FORMAT, true);

  return parsed.isValid() ? parsed.toDate() : null;
}
