import EditEventSkeleton from "@/features/event-form/components/editEventSkeleton";

export default function EditEventLoading() {
  return (
    <div className="bg-accent/10 rounded-3xl p-8 flex flex-col gap-4 justify-center max-w-6xl">
      <EditEventSkeleton />
    </div>
  );
}
