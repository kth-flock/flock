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

const linkButtonProps = {
  variant: "secondary",
  externalLink: true,
  iconPlacement: "left",
  className: "text-nowrap",
} as const;

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

  const groupStyle =
    "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between";

  const revealButtonStyle =
    "group text-nowrap lg:pointer-fine:gap-0 lg:pointer-fine:px-3 lg:pointer-fine:hover:pr-4 lg:pointer-fine:focus-visible:pr-4";
  const revealLabelStyle =
    "overflow-hidden transition-all duration-300 lg:pointer-fine:max-w-0 lg:pointer-fine:opacity-0 lg:pointer-fine:group-hover:ml-1.5 lg:pointer-fine:group-hover:max-w-xs lg:pointer-fine:group-hover:opacity-100 lg:pointer-fine:group-focus-visible:ml-1.5 lg:pointer-fine:group-focus-visible:max-w-xs lg:pointer-fine:group-focus-visible:opacity-100";

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
          <div className="hidden shrink-0 lg:block">
            <Button
              {...linkButtonProps}
              href={getGoogleCalendarUrl(event)}
              icon={<FaCalendarPlus />}
              className={revealButtonStyle}
            >
              <span className={revealLabelStyle}>Add to Google Calendar</span>
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
            <div className="hidden shrink-0 lg:block">
              <Button
                {...linkButtonProps}
                href={getGoogleMapsUrl(event)}
                icon={<FaMapLocationDot />}
                className={revealButtonStyle}
              >
                <span className={revealLabelStyle}>Find on Google Maps</span>
              </Button>
            </div>
          )}
        </div>
      )}

      {!hasPassed && (
        <div className="flex flex-wrap justify-center gap-2 lg:hidden">
          <Button
            {...linkButtonProps}
            href={getGoogleCalendarUrl(event)}
            icon={<FaCalendarPlus />}
          >
            Add to Calendar
          </Button>
          {hasLocation && (
            <Button
              {...linkButtonProps}
              href={getGoogleMapsUrl(event)}
              icon={<FaMapLocationDot />}
            >
              Find on Maps
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
