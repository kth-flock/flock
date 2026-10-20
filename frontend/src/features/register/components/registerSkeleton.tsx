import Skeleton from "@/shared/components/skeleton";

function FieldSkeleton() {
  return <Skeleton className="h-16 w-full md:h-20" />;
}

export default function RegisterSkeleton() {
  return (
    <>
      <Skeleton className="mx-auto h-10 w-36" />
      <div className="flex flex-col gap-4 md:min-w-lg md:flex-row">
        <FieldSkeleton />
        <FieldSkeleton />
      </div>
      <FieldSkeleton />
      <div className="flex flex-col gap-4 md:flex-row">
        <FieldSkeleton />
        <FieldSkeleton />
      </div>
      <Skeleton className="h-11 w-full rounded-full" />
    </>
  );
}
