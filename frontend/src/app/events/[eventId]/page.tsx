import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnnouncementList from "@/features/event/components/user-updates-list";
import EventHeader from "@/features/event/components/event-header";
import { getEvent } from "@/features/event/api";

export async function generateMetadata({
  params,
}: PageProps<"/events/[eventId]">): Promise<Metadata> {
  const { eventId } = await params;
  const event = await getEvent(eventId);
  return { title: event ? `${event.title} • Flock` : "Event not found • Flock" };
}

export default async function EventPage({
  params,
}: PageProps<"/events/[eventId]">) {
  const { eventId } = await params;
  const event = await getEvent(eventId);

  if (!event) notFound();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 pb-16">
      <EventHeader event={event} />
      <AnnouncementList announcements={event.announcements} />
    </main>
  );
}
