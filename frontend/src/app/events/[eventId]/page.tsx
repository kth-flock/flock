import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EventHeader from "@/features/event/components/eventHeader";
import UserUpdateList from "@/features/event/components/userUpdateList";
import { getEvent } from "@/features/event/lib/api";

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
      <UserUpdateList announcements={event.announcements} />
    </main>
  );
}
