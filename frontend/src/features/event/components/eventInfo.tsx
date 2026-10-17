import type { ExtendedEvent } from "@/shared/types/event";
import { DeleteEventButton } from "../../event-form/components/deleteEvent";
import RsvpButtons from "./rsvpButtons";
import EventHeader from "./eventHeader";
import EventDetails from "./eventDetails";
import Button from "@/shared/components/button";
import { FaPenToSquare } from "react-icons/fa6";
import InviteButton from "./inviteButton";
import type { ExtendedInvitee } from "@/shared/types/event";

export default function EventInfo({
  event,
  isHost,
  userId,
  onChange,
}: {
  event: ExtendedEvent;
  isHost: boolean;
  userId: number;
  onChange: () => void;
}) {
  const myInvite = event.invitees.find((invitee) => invitee.userId === userId);
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
            <InviteButton
              invitees={event.invitees.map(
                (invitee: ExtendedInvitee) => invitee.user,
              )}
              eventId={event.id}
              onChange={onChange}
            />
          </div>
        ) : (
          <RsvpButtons
            eventId={event.id}
            initialRsvp={myInvite?.rsvp ?? "PENDING"}
            initialComment={myInvite?.rsvpComment ?? ""}
            onChange={onChange}
          />
        ))}

      <EventDetails event={event} hasPassed={hasPassed} />

      {hasPassed && isHost && (
        <div className="flex justify-center">
          <DeleteEventButton eventId={event.id} />
        </div>
      )}

      {event.description && (
        <section className="flex flex-col gap-2">
          <h2 className="flock-h2 text-primary">About this event</h2>
          <p className="flock-body whitespace-pre-line">{event.description}</p>
        </section>
      )}
    </div>
  );
}
