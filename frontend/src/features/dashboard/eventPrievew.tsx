import {
  FaCalendar,
  FaClock,
  FaLocationDot,
  FaCircleCheck,
} from "react-icons/fa6";
import {
  formatDate,
  formatRelativeDate,
  formatTimeRange,
} from "@/shared/lib/dateFormat";
import Link from "next/link";
import Image from "next/image";
import type { EventDetails } from "@/features/event/lib/types";

export default function EventPreview({ event }: { event: EventDetails }) {
  return (
    <Link
      href={`/event/${event.id}`}
      className="block rounded-2xl shadow-md bg-white w-full overflow-hidden hover:shadow-lg hover:scale-[0.98] transition-all"
    >
      <div className="relative bg-neutral w-full h-36">
        {event.imageUrl && (
          <Image
            src={event.imageUrl}
            alt=""
            fill
            sizes="(min-width: 48rem) 32rem, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="p-6 flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="flock-h4">{event.title}</span>
          {/* TODO: Use real RSVP status here */}
          <span className="inline-flex gap-2 items-center flock-body text-secondary">
            <FaCircleCheck />
            Going
          </span>
        </div>

        <span className="flex flex-wrap gap-x-4 gap-y-2">
          <span className="inline-flex gap-2 items-center flock-body text-nowrap" title="Date">
            <FaCalendar />
            <time dateTime={event.startsAt} title={formatDate(event.startsAt)}>
              {formatRelativeDate(event.startsAt)}
            </time>
          </span>
          <span className="inline-flex gap-2 items-center flock-body text-nowrap">
            <FaClock />
            {formatTimeRange(event.startsAt, event.endsAt)}
          </span>
        </span>
        {event.locationName && (
          <span className="inline-flex gap-2 items-center flock-body">
            <FaLocationDot />
            {event.locationName}
          </span>
        )}
      </div>
    </Link>
  );
}

export function SmallEventPreview({ event }: { event: EventDetails }) {
  return (
    <Link
      href={`/event/${event.id}`}
      className="flex h-28 w-full overflow-hidden rounded-2xl shadow-md bg-neutral/25 hover:shadow-lg hover:scale-[0.98] transition-all"
    >
      <div className="relative w-1/2 bg-primary">
        {event.imageUrl && (
          <Image
            src={event.imageUrl}
            alt=""
            fill
            sizes="(min-width: 48rem) 16rem, 50vw"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center gap-1 p-4">
        <span className="flex justify-between">
          <p className="flock-ui-label">{event.title}</p>
          {/* TODO: Use the user's real RSVP status */}
          <FaCircleCheck className="fill-secondary" />
        </span>

        <span className="inline-flex items-center gap-1 flock-caption" title="Date">
          <FaCalendar />
          <time dateTime={event.startsAt} title={formatDate(event.startsAt)}>
            {formatRelativeDate(event.startsAt)}
          </time>
        </span>

        {event.locationName && (
          <span className="inline-flex items-center gap-1 flock-caption text-nowrap">
            <FaLocationDot />
            {event.locationName}
          </span>
        )}
      </div>
    </Link>
  );
}
