import { notFound } from "next/navigation";
import { idSchema } from "@flock/shared/schemas/common";
import EventPageClient from "@/features/event/components/eventPageClient";

export default async function EventPage({
  params,
}: PageProps<"/event/[eventId]">) {
  const parsed = idSchema.safeParse((await params).eventId);

  
  if (!parsed.success) notFound();
  throw new Error("test error boundary");

  //return <EventPageClient eventId={parsed.data} />;
  
}
