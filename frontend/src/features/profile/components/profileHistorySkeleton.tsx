import Skeleton from "@/shared/components/skeleton";

function HistoryCardSkeleton() {
  return (
    <div className="flex min-h-28 w-full overflow-hidden rounded-2xl bg-neutral/25 shadow-md">
      <Skeleton className="w-1/2 shrink-0 rounded-none" />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export default function ProfileHistorySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <HistoryCardSkeleton />
      <HistoryCardSkeleton />
      <HistoryCardSkeleton />
    </div>
  );
}
