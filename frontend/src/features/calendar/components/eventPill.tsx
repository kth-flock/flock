import type { CalendarEvent } from "../lib/types";
import {
  formatTime,
  formatShortDate,
  formatDateRange,
} from "@/shared/lib/dateFormat";
import { fullName } from "@/shared/lib/user";
import { FaCrown } from "react-icons/fa6";
import Link from "next/link";
import { useAuth } from "@/shared/auth/authContext";
import { twMerge } from "tailwind-merge";
import RsvpStatus from "@/features/rsvp/components/rsvpStatus";
import { FaMinus } from "react-icons/fa6";
import { isSameDay } from "../lib/utils";

const EventDetailStyles = {
  PENDING: "border border-primary hover:bg-primary/10",
  ACCEPTED: "bg-primary/15 text-primary hover:bg-primary/25",
  MAYBE: "bg-warn/15 hover:bg-warn/25",
  DECLINED: "bg-error/15 text-text-muted hover:bg-error/25",
  HOST: "bg-info/15  hover:bg-info/25",
};

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
  const { user } = useAuth();
  const isHost = event.createdById === user?.id;
  const status = isHost ? "HOST" : event.invitees?.[0]?.rsvp;
  const startsToday = isSameDay(event.startsAt, day);
  const endsToday = event.endsAt ? isSameDay(event.endsAt, day) : true;
  const isMultiDay =
    event.endsAt !== null && !isSameDay(event.startsAt, event.endsAt);
  const showStatus = Boolean(status) && (!isMultiDay || endsToday || isWeekEnd);

  // label on the first day, and again at the start of each week row
  const showLabel = startsToday || isWeekStart;

  return (
    <div
      className={twMerge(
        "h-10 shrink-0 truncate px-2 py-0.5 text-left flock-caption",
        EventDetailStyles[status],
        status === "DECLINED" ? "line-through" : "",
        startsToday ? "rounded-l-lg" : !isWeekStart && "-ml-[8.5px]",
        endsToday ? "rounded-r-lg" : !isWeekEnd && "-mr-[8.5px]",
      )}
    >
      {/* invisible, not removed, so every segment keeps the same height */}
      <div
        className={twMerge(
          "min-w-0",
          isMultiDay
            ? "flex h-full items-center gap-2"
            : "flex flex-col gap-1",
          isMultiDay && !showLabel && showStatus && "justify-end",
          !showLabel && !showStatus && "invisible",
        )}
      >
        <span
          className={twMerge(
            "font-semibold inline-flex items-center",
            isMultiDay
              ? "min-w-0 flex-1 justify-between gap-1"
              : `shrink-0 ${startsToday ? "justify-between" : "justify-end"}`,
            isMultiDay && !showLabel && "hidden",
          )}
        >
          {isMultiDay ? (
            <>
              {startsToday && (
                <span className="shrink-0">
                  {formatTime(event.startsAt)}
                </span>
              )}
              <span className="min-w-0 flex-1 truncate font-normal">
                {event.title}
              </span>
            </>
          ) : (
            <>
              {startsToday && formatTime(event.startsAt)}
              {status && showStatus && <RsvpStatus rsvp={status} />}
            </>
          )}
        </span>
        {isMultiDay && showStatus && status && <RsvpStatus rsvp={status} />}
        {!isMultiDay && <span className="truncate">{event.title}</span>}
      </div>
    </div>
  );
}

export function EventPillDetails({
  event,
  day,
}: {
  event: CalendarEvent;
  day: Date;
}) {
  const { user } = useAuth();
  const isHost = event.createdById === user?.id;
  const status = isHost ? "HOST" : event.invitees?.[0]?.rsvp;
  const hostLabel = isHost ? "You" : fullName(event.createdBy);
  const rsvp = event.invitees?.[0]?.rsvp;

  const startsToday = isSameDay(event.startsAt, day);
  const endsToday = event.endsAt ? isSameDay(event.endsAt, day) : true;

  return (
    <div className="w-full flex gap-6 items-center">
      <span
        className={twMerge(
          "shrink-0 w-14 md:w-16 flex flex-col items-end",
          rsvp === "DECLINED" ? "line-through" : "",
        )}
      >
        {/* Event spans across whole day */}
        {!startsToday && !endsToday && (
          <span className="flock-lead font-semibold!">All day</span>
        )}

        {/* Event starts today*/}
        {startsToday && (
          <>
            <span className="flock-lead font-semibold!">
              {formatTime(event.startsAt)}
            </span>
            {endsToday && event.endsAt && (
              <span className="inline-flex gap-1 items-center flock-caption text-text-muted">
                <FaMinus aria-hidden size={7} />
                {formatTime(event.endsAt)}
              </span>
            )}
            {!endsToday && event.endsAt && (
              <span className="inline-flex gap-1 items-center flock-caption text-text-muted">
                <FaMinus aria-hidden size={7} />
                {formatShortDate(event.endsAt)}
              </span>
            )}
          </>
        )}

        {/* Event ends today */}
        {!startsToday && endsToday && (
          <>
            <span className="flock-lead font-semibold!">
              {formatShortDate(event.startsAt)}
            </span>
            {event.endsAt && (
              <span className="inline-flex gap-1 items-center flock-caption text-text-muted">
                <FaMinus aria-hidden size={7} />
                {formatTime(event.endsAt)}
              </span>
            )}
          </>
        )}
      </span>
      <Link
        href={`/event/${event.id}`}
        className={twMerge(
          "flex flex-col w-full gap-1 truncate rounded-lg px-4 py-2",
          EventDetailStyles[status],
        )}
      >
        <span
          className={twMerge(
            "truncate flock-body font-semibold! inline-flex justify-between items-center",
            rsvp === "DECLINED" ? "line-through" : "",
          )}
        >
          {event.title}
          {status && <RsvpStatus rsvp={status} />}
        </span>
        {!(startsToday && endsToday) && event.endsAt && (
          <span className="flock-caption">
            {formatDateRange(event.startsAt, event.endsAt)}
          </span>
        )}
        <span className="inline-flex gap-1 items-center">
          <FaCrown />
          <span className="flock-ui-label text-text-muted">{hostLabel}</span>
        </span>
      </Link>
    </div>
  );
}
