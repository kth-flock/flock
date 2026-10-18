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
  formatRelativeDate,
  formatTimeRange,
} from "@/shared/lib/dateFormat";
import Link from "next/link";
import Image from "next/image";
import Button from "@/shared/components/button";
import type { EventSummary, Rsvp } from "@/features/event/lib/types";

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
          <Image
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
            className="inline-flex gap-2 items-center flock-body text-nowrap"
            title="Date"
          >
            <FaCalendar />
            <time
              dateTime={event.startsAt.toISOString()}
              title={formatDate(event.startsAt)}
            >
              {formatRelativeDate(event.startsAt)}
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
  return (
    <Link
      href={`/event/${event.id}`}
      className="flex min-h-28 w-full overflow-hidden rounded-2xl shadow-md bg-neutral/25 hover:shadow-lg hover:scale-[0.98] transition-all"
    >
      <div className="relative w-1/2 shrink-0 bg-primary">
        {event.imageUrl ? (
          <Image
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
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-4">
        <span className="flex justify-between items-start gap-2">
          <p
            className="flock-ui-label min-w-0 line-clamp-2 wrap-break-word"
            title={event.title}
          >
            {event.title}
          </p>
          <span
            className="mt-0.5 shrink-0"
            title={statusIcon[status].label}
            aria-label={statusIcon[status].label}
          >
            {statusIcon[status].icon}
          </span>
        </span>

        <span
          className="inline-flex items-center gap-1 flock-caption"
          title="Date"
        >
          <FaCalendar />
          <time
            dateTime={event.startsAt.toISOString()}
            title={formatDate(event.startsAt)}
          >
            {formatRelativeDate(event.startsAt)}
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
