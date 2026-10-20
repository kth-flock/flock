import {
  FaCalendar,
  FaClock,
  FaLocationDot,
  FaCirclePlus,
} from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import {
  formatDate,
  formatWeekdayDate,
  formatMultiDayRange,
  isMultiDay,
  isOngoing,
  formatTimeRange,
  getRelativeDatetime,
} from "@/shared/lib/dateFormat";
import Link from "next/link";
import Button from "@/shared/components/button";
import type { EventSummary, Rsvp } from "@/features/event/lib/types";
import RsvpStatus from "@/features/rsvp/components/rsvpStatus";
import EventImage from "@/shared/components/eventImage";
import OngoingPill from "@/features/event/components/ongoingPill";

export type EventStatus = Rsvp | "HOST";

const chipLabel: Record<EventStatus, string> = {
  HOST: "Hosting",
  ACCEPTED: "Going",
  MAYBE: "Maybe",
  DECLINED: "Not going",
  PENDING: "Not answered",
};

const hasEnded = (event: EventSummary) =>
  (event.endsAt ?? event.startsAt).getTime() < Date.now();

const statusChipStyle: Record<EventStatus, string> = {
  HOST: "bg-info-light text-info-dark!",
  ACCEPTED: "bg-success-light text-success-dark!",
  MAYBE: "bg-warn-light text-warn-dark!",
  DECLINED: "bg-error-light text-error-dark!",
  PENDING: "bg-neutral text-foreground!",
};

export default function EventPreview({
  event,
  status,
  statusLabel,
}: {
  event: EventSummary;
  status: EventStatus;
  statusLabel?: string;
}) {
  return (
    <Link
      href={`/event/${event.id}`}
      className="block rounded-2xl shadow-md bg-neutral/20  w-full overflow-hidden hover:shadow-lg hover:scale-[0.98] transition-all"
    >
      <div className="relative w-full h-36">
        <EventImage
          src={event.imageUrl}
          alt={event.title}
          fill
          sizes="(min-width: 48rem) 32rem, 100vw"
          className="object-cover"
        />
        <div className="absolute left-3 top-3 right-2 flex flex-wrap gap-1.5">
          <span
            className={twMerge(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 flock-body-sm ring-[1.5px] ring-current [&_svg]:fill-current",
              statusChipStyle[status],
            )}
          >
            <span aria-hidden className="inline-flex">
              <RsvpStatus rsvp={status} />
            </span>
            {statusLabel ?? chipLabel[status]}
          </span>
          {isOngoing(event.startsAt, event.endsAt) && <OngoingPill />}
        </div>
      </div>
      <div className="p-6 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-4">
          <span className="flock-h4 min-w-0 truncate" title={event.title}>
            {event.title}
          </span>
        </div>

        {/* A separate time range would read as "17:00 - 09:00" on the same
            day, so events over several days get one row with both days */}
        {isMultiDay(event.startsAt, event.endsAt) ? (
          <span
            className="inline-flex gap-2 items-center flock-body capitalize"
            title="Date"
          >
            <FaCalendar className="shrink-0" />
            <time
              dateTime={event.startsAt.toISOString()}
              title={`${formatDate(event.startsAt)} – ${formatDate(event.endsAt!)}`}
            >
              {formatMultiDayRange(event.startsAt, event.endsAt!)}
            </time>
          </span>
        ) : (
          <span className="flex flex-wrap gap-x-4 gap-y-2">
            <span
              className="inline-flex gap-2 items-center flock-body text-nowrap capitalize"
              title="Date"
            >
              <FaCalendar />
              <time
                dateTime={event.startsAt.toISOString()}
                title={formatDate(event.startsAt)}
              >
                {getRelativeDatetime(event.startsAt)}
              </time>
            </span>
            <span className="inline-flex gap-2 items-center flock-body text-nowrap">
              <FaClock />
              {formatTimeRange(event.startsAt, event.endsAt)}
            </span>
          </span>
        )}
        {event.locationName && (
          <span
            className="flex gap-2 items-start flock-body"
            title={event.locationName}
          >
            <FaLocationDot className="mt-1 shrink-0" />
            <span className="min-w-0 line-clamp-2 wrap-break-word">
              {event.locationName}
            </span>
          </span>
        )}
      </div>
    </Link>
  );
}

export function SmallEventPreview({
  event,
  status,
  statusLabel,
}: {
  event: EventSummary;
  status: EventStatus;
  statusLabel?: string;
}) {
  const passed = hasEnded(event);

  return (
    <Link
      href={`/event/${event.id}`}
      className="flex min-h-28 w-full overflow-hidden rounded-2xl shadow-md bg-neutral/25 hover:shadow-lg hover:scale-[0.98] transition-all"
    >
      <div className="relative w-1/2 shrink-0">
        <EventImage
          src={event.imageUrl}
          alt={event.title}
          fill
          sizes="(min-width: 48rem) 16rem, 50vw"
          className="object-cover"
        />
        <div className="absolute left-2 top-2 right-2 flex flex-wrap gap-1">
          <span
            className={twMerge(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 flock-caption ring-[1.5px] ring-current [&_svg]:fill-current",
              statusChipStyle[status],
            )}
          >
            <span aria-hidden className="inline-flex">
              <RsvpStatus rsvp={status} />
            </span>
            {statusLabel ?? chipLabel[status]}
          </span>
          {isOngoing(event.startsAt, event.endsAt) && <OngoingPill size="sm" />}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-4">
        <p className="flock-ui-label min-w-0 truncate" title={event.title}>
          {event.title}
        </p>

        <span
          className={twMerge(
            "inline-flex items-center gap-1 flock-caption capitalize",
            passed && "text-error!",
          )}
          title={passed ? "Date (this event is over)" : "Date"}
        >
          <FaCalendar />
          <time
            dateTime={event.startsAt.toISOString()}
            title={formatDate(event.startsAt)}
            className="inline-flex"
          >
            {getRelativeDatetime(event.startsAt)}
            {getRelativeDatetime(event.startsAt) !==
              formatWeekdayDate(event.startsAt) && (
              <span className="inline-block scale-80 ">
                {formatWeekdayDate(event.startsAt)}
              </span>
            )}
          </time>
        </span>

        {event.locationName && (
          <span
            className="flex items-start gap-1 flock-caption"
            title={event.locationName}
          >
            <FaLocationDot className="mt-0.5 shrink-0" />
            <span className="min-w-0 line-clamp-2 wrap-break-word">
              {event.locationName}
            </span>
          </span>
        )}
      </div>
    </Link>
  );
}

export function NoNextEvent() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-accent p-8 text-center">
      <div className="flex flex-col gap-1">
        <p className="flock-h4">No events coming up</p>
        <p className="flock-body-sm text-text-muted">
          Create one and invite your friends!
        </p>
      </div>
      <Button href="/create-event" icon={<FaCirclePlus />} iconPlacement="left">
        Create event
      </Button>
    </div>
  );
}

export function NoUpcomingEvents() {
  return (
    <p className="w-full rounded-2xl border-2 border-dashed border-accent p-6 text-center flock-body-sm text-text-muted">
      Nothing else planned yet.
    </p>
  );
}
