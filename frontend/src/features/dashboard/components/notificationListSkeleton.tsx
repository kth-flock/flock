import Skeleton from "@/shared/components/skeleton";

function NotificationRowSkeleton() {
  return (
    <div className="flex items-start gap-3 p-4">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export default function NotificationListSkeleton() {
  return (
    <div className="flex w-full flex-col">
      <NotificationRowSkeleton />
      <div className="w-full border-b border-primary/20" />
      <NotificationRowSkeleton />
      <div className="w-full border-b border-primary/20" />
      <NotificationRowSkeleton />
    </div>
  );
}
