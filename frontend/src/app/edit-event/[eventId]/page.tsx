import { notFound } from "next/navigation";
import { idSchema } from "@flock/shared/schemas/common";
import { getEvent, getCurrentUser } from "@/shared/lib/api";
import EditEventForm from "@/features/edit-event/editEventForm";
import { cookies } from "next/headers";

export default async function EditEventPage({
  params,
}: PageProps<"/edit-event/[eventId]">) {
  const cookie = (await cookies()).toString();

  // ---- GET EVENT AND USER ----
  const { eventId } = await params;
  const parsedEventId = idSchema.safeParse(eventId);
  if (!parsedEventId.success) notFound();

  const [user, event] = await Promise.all([
    getCurrentUser(cookie),
    getEvent(parsedEventId.data, cookie),
  ]);

  if (!event) notFound();
  if (!user) notFound();

  // ---- CHECK PERMISSIONS ----
  const isHost = event.createdById === user.id;
  if (!isHost) notFound();

  return (
    <main className="bg-accent/10 rounded-3xl p-8 flex flex-col gap-4 justify-center max-w-6xl">
      <EditEventForm event={event} />
    </main>
  );
}
