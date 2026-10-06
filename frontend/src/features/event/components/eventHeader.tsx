import Image from "next/image";
import { FaCalendarDays, FaCalendarPlus, FaLocationDot } from "react-icons/fa6";
import Button from "@/shared/components/button";
import ProfileImage from "@/shared/components/profileImage";
import { formatDateTimeRange } from "@/shared/lib/dateFormat";
import { fullName } from "@/shared/lib/user";
import type { PublicUser } from "@/shared/types/user";
import { googleCalendarUrl } from "../lib/calendar";
import type { ExtendedEvent } from "@/shared/types/event";
import RsvpButtons from "./rsvpButtons";

function HostedBy({ host }: { host: PublicUser }) {
  return (
    <div className="flock-body-sm flex items-center gap-2">
      {host.imageUrl ? (
        <ProfileImage profileImgSrc={host.imageUrl} />
      ) : (
        <ProfileImage firstName={host.firstName} lastName={host.lastName} />
      )}
      <span>
        Hosted by <span className="flock-ui-label">{fullName(host)}</span>
      </span>
    </div>
  );
}

export default function EventHeader({
  event,
  isHost,
}: {
  event: ExtendedEvent;
  isHost: boolean;
}) {
  return (
    <header className="flex flex-col gap-6">
      {event.imageUrl ? (
        <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-lg md:h-96">
          <Image
            src={event.imageUrl}
            alt=""
            fill
            sizes="(min-width: 48rem) 48rem, 100vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
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
    </header>
  );
}
