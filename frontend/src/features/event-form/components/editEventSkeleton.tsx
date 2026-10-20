import Skeleton from "@/shared/components/skeleton";

export default function EditEventSkeleton() {
  return (
    <div className="flex w-full min-w-72 md:min-w-170 flex-col gap-2 md:gap-4">
      <Skeleton className="mx-auto h-10 w-48" />
      <Skeleton className="h-40 w-full rounded-2xl md:h-56" />
      <Skeleton className="h-50 w-full rounded-2xl md:h-56" />
      <Skeleton className="mt-2 h-24 w-full rounded-2xl" />
      <div className="flex w-full justify-between">
        <Skeleton className="h-11 w-24 rounded-full" />
        <Skeleton className="h-11 w-24 rounded-full" />
      </div>
      <Skeleton className="mt-2 h-24 w-full rounded-2xl" />
    </div>
  );
}
