import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EventInfo from "@/features/event/components/eventInfo";
import AnnouncementList from "@/features/event/components/announcementList";
import { getEvent, getCurrentUser } from "@/shared/lib/apiFetch";
import { idSchema } from "@flock/shared/schemas/common";

export async function generateMetadata({
  params,
}: PageProps<"/event/[eventId]">): Promise<Metadata> {
  const { eventId } = await params;

  const parsedEventId = idSchema.safeParse(eventId);
  if (!parsedEventId.success) {
    notFound();
  }

  const event = await getEvent(parsedEventId.data);
  return {
    title: event ? `${event.title} • Flock` : "Event not found • Flock",
  };
}

export default async function EventPage({
  params,
}: PageProps<"/event/[eventId]">) {
  // ---- GET EVENT ----
  const { eventId } = await params;
  const parsedEventId = idSchema.safeParse(eventId);
  if (!parsedEventId.success) notFound();
  const event = await getEvent(parsedEventId.data);
  if (!event) notFound();

  // ---- GET CURRENT USER ----
  //const user = await getCurrentUser();
  //if (!user) notFound();

  // ---- logic ----
  //const isHost = event.createdById === user.id;
  const isHost = false;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
      <EventInfo event={event} isHost={isHost} />
      <AnnouncementList
        announcements={event.announcements}
        eventId={event.id}
        isHost={isHost}
      />
    </main>
  );
}
