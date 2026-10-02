import CreateEventFlow from "@/features/create-event/components/createEventFlow";

// TODO: Add loading page

export default function CreateEventPage() {
  return (
    <main className="bg-accent/10 rounded-3xl p-8 flex flex-col gap-4 justify-center max-w-6xl">
      <CreateEventFlow />
    </main>
  );
}
