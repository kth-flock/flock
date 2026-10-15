import type { CalendarEvent } from "./calendarView";
import { formatTime } from "@/shared/lib/dateFormat";
import { fullName } from "@/shared/lib/user";
import { FaCrown } from "react-icons/fa6";
import Link from "next/link";

export default function EventPill({ event }: { event: CalendarEvent }) {
  return (
    <div className="flex flex-col w-full gap-1 truncate rounded-lg bg-primary/15 px-2 py-0.5 text-left flock-caption text-primary hover:bg-primary/25">
      <span className="shrink-0 font-semibold">
        {formatTime(event.startsAt)}
      </span>
      <span className="truncate">{event.title}</span>
    </div>
  );
}

export function EventPillDetails({ event }: { event: CalendarEvent }) {
  return (
    <div className="w-full flex gap-6 items-center">
      <span className="shrink-0 flock-lead font-semibold!">
        {formatTime(event.startsAt)}
      </span>
      <Link
        href={`/event/${event.id}`}
        className="flex flex-col w-full gap-1 truncate rounded-lg bg-primary/15 px-4 py-2 text-primary hover:bg-primary/25"
      >
        <span className="truncate flock-body font-semibold!">
          {event.title}
        </span>
        <span className="inline-flex gap-2 items-center">
          <FaCrown />
          <span className="flock-ui-label text-(--color-text-muted)">
            {fullName(event.createdBy)}
          </span>
        </span>
      </Link>
    </div>
  );
}
