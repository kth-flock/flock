"use client";
import Image from "next/image";
import type { ExtendedEvent } from "@/shared/types/event";
import ProfileImage from "@/shared/components/profileImage";
import { fullName } from "@/shared/lib/user";

export default function EventHeader({
  event,
  isHost,
}: {
  event: ExtendedEvent;
  isHost: boolean;
}) {
  function showInvitees() {
    // TODO: Show a pop-up with invitees
  }

  return (
    <div className="relative flex flex-col justify-end h-64 w-full overflow-hidden rounded-2xl shadow-lg md:h-96">
      <Image
        src={event.imageUrl ?? "/placeholder.png"}
        alt=""
        fill
        sizes="(min-width: 48rem) 48rem, 100vw"
        loading="eager"
        fetchPriority="high"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

      <div className="w-full flex justify-between items-end p-6 md:p-8 z-20">
        <div className="flex flex-col gap-3 text-white drop-shadow-md ">
          <h1 className="flock-h1">{event.title}</h1>
          <div className="flock-body-sm flex items-center gap-2">
            <ProfileImage
              profileImgSrc={event.createdBy.imageUrl ?? ""}
              firstName={event.createdBy.firstName}
              lastName={event.createdBy.lastName}
            />

            <span>
              Hosted by{" "}
              <span className="flock-ui-label">
                {isHost ? "you" : fullName(event.createdBy)}
              </span>
            </span>
          </div>
        </div>
        {event.invitees?.length > 0 && (
          <button
            onClick={showInvitees}
            aria-label="See invitees"
            className="-mr-2 -mb-2 flex flex-row group bg-neutral/30 hover:bg-neutral p-2 rounded-full cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all"
          >
            {[...event.invitees].slice(0, 3)?.map(({ user }) => (
              <div
                key={user.id}
                className="-mr-3 relative rounded-full shadow-sm"
              >
                <ProfileImage
                  profileImgSrc={user.imageUrl ?? ""}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  className="bg-accent!"
                />
              </div>
            ))}
            {event.invitees?.length >= 3 && (
              <div className=" rounded-full overflow-hidden h-8 w-8 shrink-0 group relative shadow-sm">
                <div className="@container group relative flex h-full w-full items-center justify-center bg-white">
                  <span className="text-[40cqw]! flock-ui-label leading-none">
                    +{event.invitees.length - 3}
                  </span>
                </div>
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
