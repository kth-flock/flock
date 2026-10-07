import {
  FaCalendarDays,
  FaCalendarPlus,
  FaLocationDot,
  FaClock,
  FaMapLocation,
} from "react-icons/fa6";
import Button from "@/shared/components/button";
import { formatTimeRange, getRelativeDatetime } from "@/shared/lib/dateFormat";
import { getGoogleCalendarUrl } from "../lib/calendar";
import { getGoogleMapsUrl } from "../lib/googleMaps";
import type { ExtendedEvent } from "@/shared/types/event";
import RsvpButtons from "./rsvpButtons";
import EventHeader from "./eventHeader";
import { twMerge } from "tailwind-merge";

export default function EventInfo({
  event,
  isHost,
}: {
  event: ExtendedEvent;
  isHost: boolean;
}) {
  // TODO: doesn't count correctly... :(
  const hasPassed =
    new Date().getTime() - new Date(event.endsAt ?? event.startsAt).getTime() <
    0;

  return (
    <div className="flex flex-col gap-6">
      <EventHeader event={event} isHost={isHost} />
      <RsvpButtons />

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
              icon={<FaMapLocation />}
              iconPlacement="left"
              className="text-nowrap"
              size="md"
            >
              Find on Google Maps
            </Button>
          </div>
        )}
      </div>

      {event.description && (
        <section className="flex flex-col gap-2">
          <h2 className="flock-h2 text-primary">About this event</h2>
          <p className="flock-body whitespace-pre-line">{event.description}</p>
        </section>
      )}
    </div>
  );
}
