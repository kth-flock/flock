import Skeleton from "@/shared/components/skeleton";

export default function UpcomingEventsSkeleton() {
  return (
    <>
      {/* matches EventPreview: image on top, title + meta below */}
      <div className="w-full overflow-hidden rounded-2xl bg-neutral/20 shadow-md">
        <Skeleton className="h-36 w-full rounded-none" />
        <div className="flex flex-col gap-2 p-6">
          <div className="flex items-start justify-between gap-4">
            <Skeleton className="h-7 w-1/2" />
            <Skeleton className="h-5 w-16 shrink-0" />
          </div>
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      <Skeleton className="mt-4 h-7 w-32" />
      <div className="flex flex-wrap justify-between gap-2">
        <Skeleton className="h-28 w-full max-w-sm rounded-2xl" />
        <Skeleton className="h-28 w-full max-w-sm rounded-2xl" />
      </div>
    </>
  );
}
