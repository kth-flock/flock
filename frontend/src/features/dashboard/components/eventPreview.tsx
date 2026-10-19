import {
  FaCalendar,
  FaClock,
  FaLocationDot,
  FaCircleCheck,
  FaCirclePlus,
  FaCircleQuestion,
  FaCircleXmark,
  FaCrown,
} from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import {
  formatDate,
  getRelativeDatetime,
  formatTimeRange,
} from "@/shared/lib/dateFormat";
import Link from "next/link";
import Button from "@/shared/components/button";
import type { EventSummary, Rsvp } from "@/features/event/lib/types";
import EventImage from "@/shared/components/eventImage";

export type EventStatus = Rsvp | "HOST";

const statusIcon: Record<
  EventStatus,
  { icon: React.ReactElement; label: string }
> = {
  HOST: { icon: <FaCrown className="fill-primary" />, label: "Hosting" },
  ACCEPTED: {
    icon: <FaCircleCheck className="fill-secondary" />,
    label: "Going",
  },
  MAYBE: { icon: <FaCircleQuestion className="fill-warn" />, label: "Maybe" },
  DECLINED: {
    icon: <FaCircleXmark className="fill-error" />,
    label: "Not going",
  },
  PENDING: {
    icon: <FaClock className="fill-(--color-text-muted)" />,
    label: "Not answered",
  },
};

const hasEnded = (event: EventSummary) =>
  (event.endsAt ?? event.startsAt).getTime() < Date.now();

// Status chip colours: the theme's light/dark pairs, which also flip in dark
// mode. flock-caption sets its own text colour, hence the !
const statusChipStyle: Record<EventStatus, string> = {
  // Same colour as hosted events in the calendar
  HOST: "bg-info-light text-info-dark!",
  ACCEPTED: "bg-success-light text-success-dark!",
  MAYBE: "bg-warn-light text-warn-dark!",
  DECLINED: "bg-error-light text-error-dark!",
  PENDING: "bg-neutral text-foreground!",
};

function ImagePlaceholder({
  title,
  className,
}: {
  title: string;
  className: string;
}) {
  return (
    <span
      aria-hidden
      className={twMerge(
        "absolute inset-0 flex items-center justify-center px-4 font-serif",
        className,
      )}
    >
      <span className="truncate">{title}</span>
    </span>
  );
}

export default function EventPreview({
  event,
  status,
}: {
  event: EventSummary;
  status: EventStatus;
}) {
  return (
    <Link
      href={`/event/${event.id}`}
      className="block rounded-2xl shadow-md bg-neutral/20  w-full overflow-hidden hover:shadow-lg hover:scale-[0.98] transition-all"
    >
      <div className="relative bg-neutral w-full h-36">
        {event.imageUrl ? (
          <EventImage
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(min-width: 48rem) 32rem, 100vw"
            className="object-cover"
          />
        ) : (
          <ImagePlaceholder
            title={event.title}
            className="text-3xl text-primary/50"
          />
        )}
      </div>
      <div className="p-6 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-4">
          <span
            className="flock-h4 min-w-0 line-clamp-2 wrap-break-word"
            title={event.title}
          >
            {event.title}
          </span>
          <span className="inline-flex shrink-0 gap-2 items-center flock-body">
            {statusIcon[status].icon}
            {statusIcon[status].label}
          </span>
        </div>

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
}: {
  event: EventSummary;
  status: EventStatus;
}) {
  const passed = hasEnded(event);

  return (
    <Link
      href={`/event/${event.id}`}
      className="flex min-h-28 w-full overflow-hidden rounded-2xl shadow-md bg-neutral/25 hover:shadow-lg hover:scale-[0.98] transition-all"
    >
      <div className="relative w-1/2 shrink-0 bg-primary">
        {event.imageUrl ? (
          <EventImage
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(min-width: 48rem) 16rem, 50vw"
            className="object-cover"
          />
        ) : (
          <ImagePlaceholder
            title={event.title}
            className="text-lg text-background/70"
          />
        )}
        <span
          className={twMerge(
            "absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 flock-caption shadow-sm [&_svg]:fill-current",
            statusChipStyle[status],
          )}
        >
          <span aria-hidden className="inline-flex">
            {statusIcon[status].icon}
          </span>
          {statusIcon[status].label}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-4">
        <p
          className="flock-ui-label min-w-0 line-clamp-2 wrap-break-word"
          title={event.title}
        >
          {event.title}
        </p>

        <span
          className={twMerge(
            "inline-flex items-center gap-1 flock-caption",
            passed && "text-error!",
          )}
          title={passed ? "Date (this event is over)" : "Date"}
        >
          <FaCalendar />
          <time
            dateTime={event.startsAt.toISOString()}
            title={formatDate(event.startsAt)}
          >
            {getRelativeDatetime(event.startsAt)}
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
