import Skeleton from "@/shared/components/skeleton";

export default function FriendPreviewSkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="size-8 rounded-full" />
    </div>
  );
}
