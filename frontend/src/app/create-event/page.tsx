import CreateEventForm from "@/features/create-event/createEventForm";

export default function CreateEventPage() {
  return (
    <main className="bg-secondary/20 rounded-3xl p-8 flex flex-col gap-4 justify-center">
      <h1 className="h1 text-center">Create Event</h1>
      <CreateEventForm />
    </main>
  );
}
