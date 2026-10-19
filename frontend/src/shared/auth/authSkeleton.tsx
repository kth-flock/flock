import Skeleton from "../components/skeleton";
import Spinner from "../components/spinner";

export default function AuthSkeleton() {
  return (
    <div className="flex w-full min-w-72 md:min-w-170 flex-col gap-2 md:gap-4">
      <Skeleton className="mx-auto h-10 w-48 flex justify-center items-center">
        <p>authenticating...</p>
        <Spinner />
      </Skeleton>
    </div>
  );
}