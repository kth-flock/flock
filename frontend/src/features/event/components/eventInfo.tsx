import type { ExtendedEvent } from "@/shared/types/event";
import RsvpButtons from "./rsvpButtons";
import EventHeader from "./eventHeader";
import EventDetails from "./eventDetails";
import Button from "@/shared/components/button";
import { FaPenToSquare, FaUserPlus } from "react-icons/fa6";

export default function EventInfo({
  event,
  isHost,
}: {
  event: ExtendedEvent;
  isHost: boolean;
}) {
  const eventEnd = new Date(event.endsAt ?? event.startsAt).getTime();
  const hasPassed = Date.now() > eventEnd;

  return (
    <div className="flex flex-col gap-6">
      <EventHeader event={event} isHost={isHost} />
      {!hasPassed &&
        (isHost ? (
          <div className="w-full flex gap-2 justify-center">
            <Button
              href={`/edit-event/${event.id}`}
              icon={<FaPenToSquare aria-hidden />}
              iconPlacement="right"
              variant="secondary"
            >
              Edit
            </Button>
            {/* TODO:  Wire up inviting*/}
            <Button
              icon={<FaUserPlus aria-hidden />}
              iconPlacement="right"
              variant="secondary"
            >
              Invite
            </Button>
          </div>
        ) : (
          <RsvpButtons />
        ))}

      <EventDetails event={event} hasPassed={hasPassed} />

      {event.description && (
        <section className="flex flex-col gap-2">
          <h2 className="flock-h2 text-primary">About this event</h2>
          <p className="flock-body whitespace-pre-line">{event.description}</p>
        </section>
      )}
    </div>
  );
}
