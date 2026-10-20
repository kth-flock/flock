import { twMerge } from "tailwind-merge";
import RsvpStatus from "@/features/rsvp/components/rsvpStatus";
import { formatTime } from "@/shared/lib/dateFormat";
import type { CalendarEvent } from "../lib/types";
import { getDayInfo, EventDetailStyles } from "../lib/utils";
import { useEventStatus } from "../hooks/useEventStatus";
import type { Rsvp } from "@/features/event/lib/types";

function SingleDayContent({
  event,
  status,
}: {
  event: CalendarEvent;
  status: Rsvp | "HOST";
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="inline-flex shrink-0 items-center justify-between font-semibold">
        {formatTime(event.startsAt)}
        <RsvpStatus rsvp={status} />
      </span>
      <span className="truncate">{event.title}</span>
    </div>
  );
}

function MultiDayContent({
  event,
  status,
  startsToday,
  showLabel,
  showStatus,
}: {
  event: CalendarEvent;
  status: Rsvp | "HOST";
  startsToday: boolean;
  showLabel: boolean;
  showStatus: boolean;
}) {
  if (!showLabel && !showStatus) return null;

  return (
    <div
      className={twMerge(
        "flex h-full min-w-0 items-center gap-2",
        !showLabel && "justify-end",
      )}
    >
      {showLabel && (
        <span className="flex min-w-0 flex-1 items-center gap-1">
          {startsToday && (
            <span className="shrink-0 font-semibold">
              {formatTime(event.startsAt)}
            </span>
          )}
          <span className="min-w-0 flex-1 truncate">{event.title}</span>
        </span>
      )}
      {showStatus && <RsvpStatus rsvp={status} />}
    </div>
  );
}

export default function EventPill({
  event,
  day,
  isWeekStart = false,
  isWeekEnd = false,
}: {
  event: CalendarEvent;
  day: Date;
  isWeekStart?: boolean;
  isWeekEnd?: boolean;
}) {
  const { status, strike } = useEventStatus(event);
  const { startsToday, endsToday, isMultiDay } = getDayInfo(event, day);

  return (
    <div
      className={twMerge(
        "h-10 shrink-0 truncate px-2 py-0.5 text-left flock-caption",
        EventDetailStyles[status],
        strike,
        startsToday ? "rounded-l-lg" : !isWeekStart && "-ml-[8.5px]",
        endsToday ? "rounded-r-lg" : !isWeekEnd && "-mr-[8.5px]",
      )}
    >
      {isMultiDay ? (
        <MultiDayContent
          event={event}
          status={status}
          startsToday={startsToday}
          showLabel={startsToday || isWeekStart}
          showStatus={endsToday || isWeekEnd}
        />
      ) : (
        <SingleDayContent event={event} status={status} />
      )}
    </div>
  );
}
