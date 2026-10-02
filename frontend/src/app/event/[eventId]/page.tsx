import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EventHeader from "@/features/event/components/eventHeader";
import AnnouncementList from "@/features/event/components/announcementList";
import { getEvent } from "@/features/event/lib/api";

export async function generateMetadata({
  params,
}: PageProps<"/event/[eventId]">): Promise<Metadata> {
  const { eventId } = await params;
  const event = await getEvent(eventId);
  return {
    title: event ? `${event.title} • Flock` : "Event not found • Flock",
  };
}

export default async function EventPage({
  params,
}: PageProps<"/event/[eventId]">) {
  const { eventId } = await params;
  const event = await getEvent(eventId);

  if (!event) notFound();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
      <EventHeader event={event} />
      <AnnouncementList announcements={event.announcements} />
    </main>
  );
}
