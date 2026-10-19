import { notFound } from "next/navigation";
import { idSchema } from "@flock/shared/schemas/common";
import EditEventClient from "@/features/event-form/components/editEventClient";

export default async function EditEventPage({
  params,
}: PageProps<"/edit-event/[eventId]">) {
  // ---- GET EVENT ID ----
  const { eventId } = await params;
  const parsedEventId = idSchema.safeParse(eventId);
  if (!parsedEventId.success) notFound();

  return (
    <div className="bg-accent/10 rounded-3xl p-8 flex flex-col gap-4 justify-center max-w-6xl">
      <EditEventClient eventId={parsedEventId.data} />
    </div>
  );
}
