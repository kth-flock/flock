import { FaCalendarDays, FaCalendarPlus, FaLocationDot } from "react-icons/fa6";
import Button from "@/shared/components/button";
import UserAvatar from "@/shared/components/userAvatar";
import { formatDateTimeRange } from "@/shared/lib/dateFormat";
import { fullName } from "@/shared/lib/user";
import type { PublicUser } from "@/shared/types/user";
import { googleCalendarUrl } from "../lib/calendar";
import type { EventDetails } from "../lib/types";
import RsvpButtons from "./rsvpButtons";

const detailStyle = "flock-lead flex items-center gap-3 text-foreground/80";
const detailIconStyle = "size-5 shrink-0 fill-secondary";

function HostedBy({ host }: { host: PublicUser }) {
  return (
    <div className="flock-body-sm flex items-center gap-2">
      <UserAvatar user={host} className="size-6" />
      <span>
        Hosted by <span className="font-semibold">{fullName(host)}</span>
      </span>
    </div>
  );
}

export default function EventHeader({ event }: { event: EventDetails }) {
  return (
    <header className="flex flex-col gap-6">
      {event.imageUrl ? (
        <div className="relative h-64 w-full overflow-hidden rounded-3xl shadow-lg md:h-96">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.imageUrl}
            alt=""
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 text-white drop-shadow-md md:p-8">
            <h1 className="flock-h1">{event.title}</h1>
            <HostedBy host={event.createdBy} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <h1 className="flock-h1 text-primary">{event.title}</h1>
          <HostedBy host={event.createdBy} />
        </div>
      )}

      <RsvpButtons />

      <div className="flex flex-col gap-4 rounded-2xl bg-accent/10 p-4 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex flex-col gap-2">
          <p className={detailStyle}>
            <FaCalendarDays className={detailIconStyle} aria-hidden />
            <time dateTime={event.startsAt}>
              {formatDateTimeRange(event.startsAt, event.endsAt)}
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
    </header>
  );
}
