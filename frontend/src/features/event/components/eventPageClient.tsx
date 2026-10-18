"use client";

import { useCallback } from "react";
import { notFound } from "next/navigation";
import { useAuth } from "@/shared/auth/authContext";
import { useFetch } from "@/shared/hooks/useFetch";
import { getEvent } from "@/features/event/lib/api";
import EventInfo from "./eventInfo";
import AnnouncementList from "../../announcements/components/announcementList";

export default function EventPageClient({ eventId }: { eventId: number }) {
  const { user } = useAuth();
  const fetchEvent = useCallback(() => getEvent(eventId), [eventId]);
  const { data: event, isLoading, error, refetch } = useFetch(fetchEvent);

  // TODO: Add loading and error
  if (user === undefined || isLoading) return;
  if (error && !event) return;
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
