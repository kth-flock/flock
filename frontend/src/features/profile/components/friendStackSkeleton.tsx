import Skeleton from "@/shared/components/skeleton";

export default function FriendStackSkeleton() {
  return (
    <div className="ml-auto flex -space-x-2">
      <Skeleton className="size-8 rounded-full ring-2 ring-background" />
      <Skeleton className="size-8 rounded-full ring-2 ring-background" />
      <Skeleton className="size-8 rounded-full ring-2 ring-background" />
    </div>
  );
}
