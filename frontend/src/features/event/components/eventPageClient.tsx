"use client";

import { notFound } from "next/navigation";
import { useAuth } from "@/shared/auth/authContext";
import { useEvent } from "@/shared/hooks/useEvent";
import EventInfo from "./eventInfo";
import AnnouncementList from "../../announcements/announcementList";

export default function EventPageClient({ eventId }: { eventId: number }) {
  const { user } = useAuth();
  const { event, isLoading, error, refetch } = useEvent(eventId);

  // TODO: Add loading and error
  if (user === undefined || isLoading) return;
  if (error) return;
  if (!user || !event) notFound();

  const isHost = event.createdById === user.id;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
      <title>{`${event.title} • Flock`}</title>
      <EventInfo
        event={event}
        isHost={isHost}
        userId={user.id}
        onChange={refetch}
      />
      <AnnouncementList
        announcements={event.announcements}
        eventId={event.id}
        isHost={isHost}
        onChange={refetch}
      />
    </div>
  );
}
