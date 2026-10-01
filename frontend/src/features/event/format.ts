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

export const formatDate = (iso: string) => dateFormatter.format(new Date(iso));
export const formatTime = (iso: string) => timeFormatter.format(new Date(iso));

export function formatEventTime(startsAt: string, endsAt: string | null) {
  const start = `${formatDate(startsAt)}, ${formatTime(startsAt)}`;
  if (!endsAt) return start;

  const sameDay = formatDate(startsAt) === formatDate(endsAt);
  const end = sameDay
    ? formatTime(endsAt)
    : `${formatDate(endsAt)}, ${formatTime(endsAt)}`;

  return `${start} – ${end}`;
}

export const fullName = (user: { firstName: string; lastName: string }) =>
  `${user.firstName} ${user.lastName}`;
