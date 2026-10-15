import type { CalendarEvent } from "./calendarView";
import { formatTime } from "@/shared/lib/dateFormat";

export default function EventPill({ event }: { event: CalendarEvent }) {
  return (
    <div
      title={`${event.title} · ${formatTime(event.startsAt)} · ${event.createdBy.firstName} ${event.createdBy.lastName}`}
      className="flex flex-col w-full gap-1 truncate rounded-lg bg-primary/15 px-2 py-0.5 text-left text-xs text-primary hover:bg-primary/25"
    >
      <span className="shrink-0 font-semibold">
        {formatTime(event.startsAt)}
      </span>
      <span className="truncate">{event.title}</span>
    </div>
  );
}
