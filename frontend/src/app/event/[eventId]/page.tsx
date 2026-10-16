import { notFound } from "next/navigation";
import EventInfo from "@/features/event/components/eventInfo";
import AnnouncementList from "@/features/event/components/announcementList";
import { getEvent, getCurrentUser } from "@/shared/lib/api";
import { idSchema } from "@flock/shared/schemas/common";
import { cookies } from "next/headers";

export async function generateMetadata({
  params,
}: PageProps<"/event/[eventId]">) {
  const { eventId } = await params;
  const parsedEventId = idSchema.safeParse(eventId);
  if (!parsedEventId.success) return { title: "Event not found • Flock" };

  const cookie = (await cookies()).toString();
  const event = await getEvent(parsedEventId.data, cookie).catch(() => null);
  return { title: event ? `${event.title} • Flock` : "Event • Flock" };
}

export default async function EventPage({
  params,
}: PageProps<"/event/[eventId]">) {
  const cookie = (await cookies()).toString();

  // ---- GET EVENT AND USER ----
  const { eventId } = await params;
  const parsedEventId = idSchema.safeParse(eventId);
  if (!parsedEventId.success) notFound();

  // TODO: Server returns error if user is not host and not invited to event. Do want to handle this specifically? Or just a general error?
  const [user, event] = await Promise.all([
    getCurrentUser(cookie),
    getEvent(parsedEventId.data, cookie),
  ]);

  if (!event) notFound();
  if (!user) notFound();

  // ---- CHECK PERMISSIONS ----
  const isHost = event.createdById === user.id;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
      <EventInfo event={event} isHost={isHost} userId={user.id} />
      <AnnouncementList
        announcements={event.announcements}
        eventId={event.id}
        isHost={isHost}
      />
    </div>
  );
}
