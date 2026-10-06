import { FaCalendarDays, FaCalendarPlus, FaLocationDot } from "react-icons/fa6";
import Button from "@/shared/components/button";
import { formatDateTimeRange } from "@/shared/lib/dateFormat";
import { googleCalendarUrl } from "../lib/calendar";
import type { ExtendedEvent } from "@/shared/types/event";
import RsvpButtons from "./rsvpButtons";
import EventHeader from "./eventHeader";

export default function EventInfo({
  event,
  isHost,
}: {
  event: ExtendedEvent;
  isHost: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      <EventHeader event={event} isHost={isHost} />
      <RsvpButtons />

      <div className="flex flex-col gap-4 rounded-2xl bg-accent/10 p-4 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex flex-col gap-2">
          <p className="flock-lead flex items-center gap-3 text-foreground/80">
            <FaCalendarDays
              className="size-5 shrink-0 fill-secondary"
              aria-hidden
            />
            <time dateTime={String(event.startsAt)}>
              {formatDateTimeRange(event.startsAt, event.endsAt)}
            </time>
          </p>
          {event.locationName && (
            <p className="flock-lead flex items-center gap-3 text-foreground/80">
              <FaLocationDot
                className="size-5 shrink-0 fill-secondary"
                aria-hidden
              />
              {event.locationName}
            </p>
          )}
        </div>

        <Button
          href={googleCalendarUrl(event)}
          variant="secondary"
          icon={<FaCalendarPlus />}
          iconPlacement="left"
          className="shrink-0 self-start md:self-center"
        >
          Add to Google Calendar
        </Button>
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
