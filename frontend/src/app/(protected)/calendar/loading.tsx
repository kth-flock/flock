import CalendarSkeleton from "@/features/calendar/components/calendarSkeleton";

export default function CalendarLoading() {
  return (
    <div className="w-full max-w-5xl">
      <CalendarSkeleton />
    </div>
  );
}
