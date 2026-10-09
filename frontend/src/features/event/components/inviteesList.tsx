import Modal from "@/shared/components/modal";
import { ExtendedEvent } from "@/shared/types/event";
import ProfileImage from "@/shared/components/profileImage";
import RSVPStatus from "@/shared/components/rsvpStatus";
import { FaCommentDots } from "react-icons/fa6";

type InviteeRsvp = ExtendedEvent["invitees"][number]["rsvp"];

type InviteesListProps = {
  event: ExtendedEvent;
  isHost?: boolean;
  isOpen: boolean;
  onClose?: () => void;
};

export function sortInviteesByRsvpStatus(invitees: ExtendedEvent["invitees"]) {
  const priority = {
    ACCEPTED: 0,
    MAYBE: 1,
    DECLINED: 2,
    PENDING: 3,
  };

  return [...invitees].sort((a, b) => priority[a.rsvp] - priority[b.rsvp]);
}

export function countInviteesByRsvpStatus(
  invitees: ExtendedEvent["invitees"],
): Record<InviteeRsvp, number> {
  return invitees.reduce(
    (counts, { rsvp }) => {
      counts[rsvp] += 1;
      return counts;
    },
    {
      ACCEPTED: 0,
      MAYBE: 0,
      DECLINED: 0,
      PENDING: 0,
    },
  );
}

export default function InviteesList({
  event,
  isHost = false,
  isOpen,
  onClose,
}: InviteesListProps) {
  const sortedInvitees = sortInviteesByRsvpStatus(event.invitees);
  const inviteeCounts = countInviteesByRsvpStatus(event.invitees);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flock-h4 flex flex-col items-center">
        <p>Invitees</p>
        <span className="flock-caption">
          {inviteeCounts.ACCEPTED} going, {inviteeCounts.MAYBE} maybe,{" "}
          {sortedInvitees.length} invited.
        </span>
        {sortedInvitees.length > 0
          ? sortedInvitees.map(({ user: invitee, rsvp, rsvpComment }) => (
              <div
                key={invitee.id}
                className="w-full grid grid-cols-[auto_minmax(0,1fr)_auto] items-center justify-center gap-x-2 gap-y-2 py-2 not-last:border-b border-neutral"
              >
                {/* TODO: Make sure it correctly links to profile page */}

                <ProfileImage
                  firstName={invitee.firstName}
                  lastName={invitee.lastName}
                  profileImgSrc={invitee.imageUrl ?? ""}
                />
                <p className="flock-body truncate">
                  {invitee.firstName} {invitee.lastName}
                </p>
                <RSVPStatus status={rsvp} className="h-4" />
                {isHost && rsvpComment && (
                  <>
                    <FaCommentDots
                      aria-hidden
                      className="place-self-center fill-secondary"
                    />
                    <span className="col-span-2 min-w-0 w-full p-1 border border-neutral flock-caption text-foreground! rounded-lg">
                      {rsvpComment}
                    </span>
                  </>
                )}
              </div>
            ))
          : "No invitees yet"}
      </div>
    </Modal>
  );
}
