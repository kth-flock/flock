import Skeleton from "@/shared/components/skeleton";

export default function EventPageSkeleton() { return (    
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 pb-16">
        <Skeleton className="h-64 md:h-96 w-full rounded-3xl" />
        <div className="flex justify-center gap-3">
            <Skeleton className="h-11 w-32 rounded-full" />
            <Skeleton className="h-11 w-32 rounded-full" />
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
    </div>
  );
}