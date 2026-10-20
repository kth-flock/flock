"use client";
import Link from "next/link";
import { useState } from "react";
import type { ExtendedEvent } from "@/shared/types/event";
import ProfileImage from "@/shared/components/profileImage";
import AvatarStack from "@/shared/components/avatarStack";
import { fullName } from "@/shared/lib/user";
import InviteesList from "./inviteesList";
import EventImage from "@/shared/components/eventImage";
import { isOngoing } from "@/shared/lib/dateFormat";
import OngoingPill from "./ongoingPill";

export default function EventHeader({
  event,
  isHost,
}: {
  event: ExtendedEvent;
  isHost: boolean;
}) {
  const [isInviteListOpen, setIsInviteListOpen] = useState(false);
  const { createdBy, invitees } = event;

  return (
    <>
      {isInviteListOpen && (
        <InviteesList
          event={event}
          isHost={isHost}
          isOpen
          onClose={() => setIsInviteListOpen(false)}
        />
      )}

      <div className="relative flex flex-col justify-end h-64 w-full overflow-hidden rounded-2xl shadow-lg md:h-96">
        <EventImage
          src={event.imageUrl}
          alt={`Cover image for ${event.title}`}
          fill
          sizes="(min-width: 48rem) 48rem, 100vw"
          loading="eager"
          fetchPriority="high"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

        <div className="z-20 flex w-full items-end justify-between p-6 md:p-8">
          <div className="flex min-w-0 flex-col gap-3 text-background drop-shadow-md">
            {isOngoing(event.startsAt, event.endsAt) && <OngoingPill />}
            <h1 className="flock-h1 wrap-break-word">{event.title}</h1>
            <Link
              href={`/profile/${createdBy.id}`}
              className="group/host flock-body-sm flex w-fit min-w-0 max-w-full items-center gap-2"
            >
              <ProfileImage
                profileImgSrc={createdBy.imageUrl ?? ""}
                firstName={createdBy.firstName}
                lastName={createdBy.lastName}
              />
              <span
                className="min-w-0 truncate group-hover/host:underline"
                title={isHost ? undefined : fullName(createdBy)}
              >
                Hosted by{" "}
                <span className="flock-ui-label">
                  {isHost ? "you" : fullName(createdBy)}
                </span>
              </span>
            </Link>
          </div>

          {invitees.length > 0 && (
            <button
              onClick={() => setIsInviteListOpen(true)}
              aria-label={`See invitees (${invitees.length})`}
              className="-mr-2 -mb-2 flex flex-row cursor-pointer rounded-full bg-neutral/30 p-2 transition-all hover:-translate-y-1 hover:bg-neutral hover:shadow-md"
            >
              <AvatarStack users={invitees.map((i) => i.user)} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
