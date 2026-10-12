import { ExtendedEvent } from "@/shared/types/event";
import { twMerge } from "tailwind-merge";
import Button from "@/shared/components/button";
import {
  FaCalendarDays,
  FaClock,
  FaLocationDot,
  FaCalendarPlus,
  FaMapLocationDot,
} from "react-icons/fa6";
import { getGoogleCalendarUrl } from "../lib/calendar";
import { getGoogleMapsUrl } from "../lib/googleMaps";
import { getRelativeDatetime, formatTimeRange } from "@/shared/lib/dateFormat";

export default function EventDetails({
  event,
  hasPassed,
}: {
  event: ExtendedEvent;
  hasPassed: boolean;
}) {
  return (
    <div
      className={twMerge(
        "flex flex-col gap-4 rounded-2xl p-4 md:flex-row md:items-center md:justify-between md:p-6",
        hasPassed ? "bg-error/10" : "bg-accent/10",
      )}
    >
      <div className="flex flex-col gap-2">
        {hasPassed && (
          <p className="flock-lead font-bold! text-error-dark">
            This event has passed
          </p>
        )}
        <time
          dateTime={String(event.startsAt)}
          className="flex gap-4 items-center"
        >
          <p className="flock-lead flex items-center gap-2 text-foreground/80 capitalize">
            <FaCalendarDays
              className={twMerge(
                "size-5 shrink-0",
                hasPassed ? "fill-error" : "fill-secondary",
              )}
              aria-hidden
            />
            {getRelativeDatetime(event.startsAt)}
          </p>
          <p className="flock-lead flex items-center gap-2 text-foreground/80 capitalize">
            <FaClock
              className={twMerge(
                "size-5 shrink-0",
                hasPassed ? "fill-error" : "fill-secondary",
              )}
              aria-hidden
            />
            {formatTimeRange(event.startsAt, event.endsAt)}
          </p>
        </time>
        {event.locationName && (
          <p className="flock-lead flex items-center gap-2 text-foreground/80">
            <FaLocationDot
              className={twMerge(
                "size-5 shrink-0",
                hasPassed ? "fill-error" : "fill-secondary",
              )}
              aria-hidden
            />
            {event.locationName}
          </p>
        )}
      </div>

      {!hasPassed && (
        <div className="flex flex-col gap-2">
          <Button
            href={getGoogleCalendarUrl(event)}
            variant="secondary"
            externalLink
            icon={<FaCalendarPlus />}
            iconPlacement="left"
            className="text-nowrap"
            size="md"
          >
            Add to Google Calendar
          </Button>
          <Button
            href={getGoogleMapsUrl(event)}
            variant="secondary"
            externalLink
            icon={<FaMapLocationDot />}
            iconPlacement="left"
            className="text-nowrap"
            size="md"
          >
            Find on Google Maps
          </Button>
        </div>
      )}
    </div>
  );
}
