import type { IconType } from "react-icons";
import {
  FaRegCalendarCheck,
  FaRegCalendar,
  FaCalendarPlus,
  FaClock,
  FaLocationDot,
  FaMapLocationDot,
} from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import Button from "@/shared/components/button";
import type { ExtendedEvent } from "@/shared/types/event";
import {
  formatEventDay,
  formatTime,
  formatTimeRange,
  getRelativeDatetime,
  isMultiDay,
} from "@/shared/lib/dateFormat";
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
    <p className="flock-lead flex items-start gap-2 text-foreground/80">
      <span className="flex h-[1lh] shrink-0 items-center">
        <Icon
          aria-hidden
          className={twMerge(
            "size-5",
            hasPassed ? "fill-error" : "fill-secondary",
          )}
        />
      </span>
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
  const clockStyle = twMerge(
    "size-4 shrink-0",
    hasPassed ? "fill-error" : "fill-secondary",
  );
  const rowIconStyle = twMerge(
    "size-5 shrink-0",
    hasPassed ? "fill-error" : "fill-secondary",
  );

  // Each button sits next to the detail it belongs to, and below it on phones
  const groupStyle =
    "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between";

  return (
    <div
      className={twMerge(
        "flex flex-col gap-4 rounded-2xl p-4 md:p-6",
        hasPassed ? "bg-error/10" : "bg-accent/10",
      )}
    >
      {hasPassed && (
        <p className="flock-lead font-bold! text-error-dark">
          This event has passed
        </p>
      )}

      <div className={twMerge(groupStyle, "lg:items-end")}>
        {isMultiDay(event.startsAt, event.endsAt) ? (
          <div className="flock-lead grid grid-cols-[auto_auto_auto_auto_1fr] items-baseline gap-x-2 gap-y-2 text-foreground/80">
            <FaRegCalendar
              aria-hidden
              className={twMerge(rowIconStyle, "self-center")}
            />
            <span className="pr-3 font-bold">Starts</span>
            <time dateTime={event.startsAt.toISOString()} className="contents">
              <span className="pr-2">{formatEventDay(event.startsAt)}</span>
              <FaClock
                aria-hidden
                className={twMerge(clockStyle, "self-center")}
              />
              <span>{formatTime(event.startsAt)}</span>
            </time>

            <FaRegCalendarCheck
              aria-hidden
              className={twMerge(rowIconStyle, "self-center")}
            />
            <span className="pr-3 font-bold">Ends</span>
            <time dateTime={event.endsAt!.toISOString()} className="contents">
              <span className="pr-2">{formatEventDay(event.endsAt!)}</span>
              <FaClock
                aria-hidden
                className={twMerge(clockStyle, "self-center")}
              />
              <span>{formatTime(event.endsAt!)}</span>
            </time>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <DetailRow icon={FaRegCalendar} hasPassed={hasPassed}>
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
        )}
        {!hasPassed && (
          <div className="shrink-0">
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
          </div>
        )}
      </div>

      {hasLocation && (
        <div className={groupStyle}>
          <DetailRow icon={FaLocationDot} hasPassed={hasPassed}>
            {event.locationName ?? "Pinned location"}
          </DetailRow>
          {!hasPassed && (
            <div className="shrink-0">
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
      )}
    </div>
  );
}
