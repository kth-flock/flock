import { FaCalendarDays, FaCalendarPlus, FaLocationDot } from "react-icons/fa6";
import Button from "@/components/button";
import { googleCalendarUrl } from "../calendar";
import type { EventDetails } from "../data";
import { formatEventTime, fullName } from "../format";
import RsvpButtons from "./rsvp-buttons";
import UserAvatar from "./user-avatar";

const detailStyle = "flex items-center gap-3 text-lg text-foreground/80";
const detailIconStyle = "size-5 shrink-0 fill-secondary";

export default function EventHeader({ event }: { event: EventDetails }) {
  return (
    <header className="flex flex-col gap-6">
      {event.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.imageUrl}
          alt=""
          className="h-48 md:h-72 w-full rounded-3xl object-cover shadow-lg"
        />
      )}

      <div className="flex flex-col gap-3">
        <h1 className="font-serif text-3xl md:text-5xl text-primary">
          {event.title}
        </h1>

        <div className="flex items-center gap-2 text-sm">
          <UserAvatar user={event.createdBy} className="size-6" />
          <span>
            Hosted by{" "}
            <span className="font-semibold">{fullName(event.createdBy)}</span>
          </span>
        </div>

        <RsvpButtons />
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-accent/10 p-4 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex flex-col gap-2">
          <p className={detailStyle}>
            <FaCalendarDays className={detailIconStyle} aria-hidden />
            <time dateTime={event.startsAt}>
              {formatEventTime(event.startsAt, event.endsAt)}
            </time>
          </p>
          {event.locationName && (
            <p className={detailStyle}>
              <FaLocationDot className={detailIconStyle} aria-hidden />
              {event.locationName}
            </p>
          )}
        </div>

        <Button
          href={googleCalendarUrl(event)}
          icon={<FaCalendarPlus />}
          iconPlacement="left"
          className="shrink-0 self-start md:self-center"
        >
          Add to Google Calendar
        </Button>
      </div>

      {event.description && (
        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-2xl text-primary">About this event</h2>
          <p className="whitespace-pre-line leading-relaxed">
            {event.description}
          </p>
        </section>
      )}
    </header>
  );
}
