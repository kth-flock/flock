import { notFound } from "next/navigation";
import { idSchema } from "@flock/shared/schemas/common";
import { getEvent } from "@/shared/lib/apiFetch";
import EditEventForm from "@/features/edit-event/editEventForm";

export default async function EditEventPage({
  params,
}: PageProps<"/edit-event/[eventId]">) {
  // ---- GET EVENT ----
  const { eventId } = await params;
  const parsedEventId = idSchema.safeParse(eventId);
  if (!parsedEventId.success) notFound();
  const event = await getEvent(parsedEventId.data);
  if (!event) notFound();

  return (
    <main className="bg-accent/10 rounded-3xl p-8 flex flex-col gap-4 justify-center max-w-6xl">
      <EditEventForm event={event} />
    </main>
  );
}
