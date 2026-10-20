import Skeleton from "@/shared/components/skeleton";

export function FriendStackSkeleton() {
  return (
    <div className="ml-auto flex -space-x-2">
      <Skeleton className="size-8 rounded-full ring-2 ring-background" />
      <Skeleton className="size-8 rounded-full ring-2 ring-background" />
      <Skeleton className="size-8 rounded-full ring-2 ring-background" />
    </div>
  );
}

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

export function ProfileHistorySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <HistoryCardSkeleton />
      <HistoryCardSkeleton />
      <HistoryCardSkeleton />
    </div>
  );
}

function StatCardSkeleton({ withFriends = false }: { withFriends?: boolean }) {
  return (
    <div className="rounded-2xl bg-accent/10 p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="size-8 shrink-0 rounded-lg" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
        {withFriends && <FriendStackSkeleton />}
      </div>
    </div>
  );
}

export default function ProfilePageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
      <Skeleton className="h-48 w-full md:h-64" />
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
        <section className="grid grid-cols-2 gap-6 md:grid-cols-1">
          <StatCardSkeleton />
          <StatCardSkeleton withFriends />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </section>
        <div className="border-t border-primary/20 pt-6 md:col-span-2 md:border-t-0 md:border-l md:pt-0 md:pl-6">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-40" />
            <ProfileHistorySkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
