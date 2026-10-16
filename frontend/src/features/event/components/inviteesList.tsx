import Link from "next/link";
import Modal from "@/shared/components/modal";
import { ExtendedEvent } from "@/shared/types/event";
import ProfileImage from "@/shared/components/profileImage";
import RSVPStatus from "@/shared/components/rsvpStatus";
import { FaCommentDots } from "react-icons/fa6";
import type { Rsvp } from "../lib/types";
import type { ExtendedInvitee } from "@/shared/types/event";
import { fullName } from "@/shared/lib/user";

type InviteesListProps = {
  event: ExtendedEvent;
  isHost?: boolean;
  isOpen: boolean;
  onClose?: () => void;
};

const rsvpGroups: { rsvp: Rsvp; label: string }[] = [
  { rsvp: "ACCEPTED", label: "Going" },
  { rsvp: "MAYBE", label: "Maybe" },
  { rsvp: "DECLINED", label: "Can't go" },
  { rsvp: "PENDING", label: "Not answered" },
];

export function countInviteesByRsvpStatus(
  invitees: ExtendedInvitee[],
): Record<Rsvp, number> {
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
  const inviteeCounts = countInviteesByRsvpStatus(event.invitees);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex w-full flex-col items-center gap-2 md:w-md">
        <p className="flock-h4">Invitees</p>
        <span className="flock-caption text-center">
          {inviteeCounts.ACCEPTED} going · {inviteeCounts.MAYBE} maybe ·{" "}
          {inviteeCounts.DECLINED} {"can't go"} · {inviteeCounts.PENDING} not
          answered
        </span>

        {event.invitees.length === 0 && (
          <p className="flock-body-sm text-(--color-text-muted)">
            No invitees yet
          </p>
        )}

        {rsvpGroups.map(({ rsvp, label }) => {
          const group = event.invitees.filter(
            (invitee) => invitee.rsvp === rsvp,
          );
          if (group.length === 0) return null;

          return (
            <section key={rsvp} className="flex w-full flex-col">
              <h3 className="flock-h6 flex items-center gap-2 border-b border-primary/20 pb-1 pt-3 text-primary">
                <RSVPStatus status={rsvp} className="h-4" />
                {label} ({group.length})
              </h3>
              <ul className="flex flex-col">
                {group.map(({ user: invitee, rsvpComment }) => (
                  <li key={invitee.id} className="flex flex-col gap-1 py-2 not-last:border-b border-neutral">
                    <Link href={`/profile/${invitee.id}`} className="group/invitee flex min-w-0 items-center gap-2 transition-colors hover:text-primary">
                      <ProfileImage
                        firstName={invitee.firstName}
                        lastName={invitee.lastName}
                        profileImgSrc={invitee.imageUrl ?? ""}
                      />
                      <span className="flock-body truncate group-hover/invitee:underline">
                        {fullName(invitee)}
                      </span>
                    </Link>
                    {isHost && rsvpComment && (
                      <p className="ml-10 flex items-start gap-2 rounded-lg border border-neutral px-2 py-1.5 flock-body-sm">
                        <FaCommentDots aria-hidden className="mt-1 shrink-0 fill-secondary" />
                        {rsvpComment}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </Modal>
  );
}
