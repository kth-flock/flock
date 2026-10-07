const skeletonStyle = "animate-pulse rounded-2xl bg-neutral/50";

export default function ProfileLoading() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
      <div className={`h-48 w-full md:h-64 ${skeletonStyle}`} />
    </main>
  );
}
