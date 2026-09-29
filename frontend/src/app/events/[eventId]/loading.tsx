const skeletonStyle = "animate-pulse rounded-2xl bg-neutral/50";

export default function EventLoading() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 pb-16">
      <div className={`h-48 md:h-72 w-full rounded-3xl ${skeletonStyle}`} />
      <div className={`h-12 w-2/3 ${skeletonStyle}`} />
      <div className={`h-20 w-full ${skeletonStyle}`} />
      <div className={`h-32 w-full ${skeletonStyle}`} />
    </main>
  );
}
