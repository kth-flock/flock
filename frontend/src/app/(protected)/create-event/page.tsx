import CreateEventFlow from "@/features/event-form/components/createEventFlow";

export default function CreateEventPage() {
  return (
    <div className="bg-accent/10 rounded-3xl p-8 flex flex-col gap-4 justify-center max-w-6xl">
      <CreateEventFlow />
    </div>
  );
}
