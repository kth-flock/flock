import Link from "next/link";
import { FaCrown, FaMinus } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import RsvpStatus from "@/features/rsvp/components/rsvpStatus";
import { formatDateRange } from "@/shared/lib/dateFormat";
import { fullName } from "@/shared/lib/user";
import type { CalendarEvent } from "../lib/types";
import { getDayInfo, getTimeLabels, EventDetailStyles } from "../lib/utils";
import { useEventStatus } from "../hooks/useEventStatus";

export default function EventPillDetails({
  event,
  day,
}: {
  event: CalendarEvent;
  day: Date;
}) {
  const { isHost, status, strike } = useEventStatus(event);
  const dayInfo = getDayInfo(event, day);
  const { main, sub } = getTimeLabels(event, dayInfo);
  const hostLabel = isHost ? "You" : fullName(event.createdBy);

  return (
    <div className="flex w-full items-center gap-6">
      <span
        className={twMerge(
          "flex w-14 shrink-0 flex-col items-end md:w-16",
          strike,
        )}
      >
        <span className="flock-lead font-semibold!">{main}</span>
        {sub && (
          <span className="inline-flex items-center gap-1 flock-caption text-text-muted">
            <FaMinus aria-hidden size={7} />
            {sub}
          </span>
        )}
      </span>

      <Link
        href={`/event/${event.id}`}
        className={twMerge(
          "flex w-full flex-col gap-1 truncate rounded-lg px-4 py-2",
          EventDetailStyles[status],
        )}
      >
        <span
          className={twMerge(
            "inline-flex items-center justify-between truncate flock-body font-semibold!",
            strike,
          )}
        >
          {event.title}
          <RsvpStatus rsvp={status} />
        </span>
        {dayInfo.isMultiDay && event.endsAt && (
          <span className="flock-caption">
            {formatDateRange(event.startsAt, event.endsAt)}
          </span>
        )}
        <span className="inline-flex min-w-0 max-w-full items-center gap-1">
          <FaCrown className="shrink-0" />
          {/* Long names are cut off with "..." */}
          <span
            className="flock-ui-label text-text-muted truncate"
            title={hostLabel}
          >
            {hostLabel}
          </span>
        </span>
      </Link>
    </div>
  );
}
