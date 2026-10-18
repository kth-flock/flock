import type { IconType } from "react-icons";
import {
  FaCalendarDays,
  FaCalendarPlus,
  FaClock,
  FaLocationDot,
  FaMapLocationDot,
} from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import Button from "@/shared/components/button";
import type { ExtendedEvent } from "@/shared/types/event";
import { formatTimeRange, getRelativeDatetime } from "@/shared/lib/dateFormat";
import { getGoogleCalendarUrl } from "../lib/calendar";
import { getGoogleMapsUrl } from "../lib/googleMaps";

function DetailRow({
  icon: Icon,
  hasPassed,
  children,
}: {
  icon: IconType;
  hasPassed: boolean;
  children: React.ReactNode;
}) {
  return (
    <p className="flock-lead flex items-center gap-2 text-foreground/80">
      <Icon
        aria-hidden
        className={twMerge(
          "size-5 shrink-0",
          hasPassed ? "fill-error" : "fill-secondary",
        )}
      />
      {children}
    </p>
  );
}

export default function EventDetails({
  event,
  hasPassed,
}: {
  event: ExtendedEvent;
  hasPassed: boolean;
}) {
  const hasLocation =
    Boolean(event.locationName) ||
    (event.latitude != null && event.longitude != null);

  return (
    <div
      className={twMerge(
        "flex flex-col gap-4 rounded-2xl p-4 md:p-6 lg:flex-row lg:items-center lg:justify-between",
        hasPassed ? "bg-error/10" : "bg-accent/10",
      )}
    >
      <div className="flex flex-col gap-2">
        {hasPassed && (
          <p className="flock-lead font-bold! text-error-dark">
            This event has passed
          </p>
        )}

        <div className="flex items-center gap-4">
          <DetailRow icon={FaCalendarDays} hasPassed={hasPassed}>
            <time
              dateTime={event.startsAt.toISOString()}
              className="capitalize"
            >
              {getRelativeDatetime(event.startsAt)}
            </time>
          </DetailRow>
          <DetailRow icon={FaClock} hasPassed={hasPassed}>
            <span className="capitalize">
              {formatTimeRange(event.startsAt, event.endsAt)}
            </span>
          </DetailRow>
        </div>

        {hasLocation && (
          <DetailRow icon={FaLocationDot} hasPassed={hasPassed}>
            {event.locationName ?? "Pinned location"}
          </DetailRow>
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
          {hasLocation && (
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
          )}
        </div>
      )}
    </div>
  );
}
