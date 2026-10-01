const skeletonStyle = "animate-pulse rounded-2xl bg-neutral/50";

// Mirrors the event page layout so content doesn't jump when it loads
export default function EventLoading() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 pb-16">
      <div className={`h-64 md:h-96 w-full rounded-3xl ${skeletonStyle}`} />
      <div className="flex justify-center gap-3 pt-2">
        <div className={`h-11 w-32 rounded-full ${skeletonStyle}`} />
        <div className={`h-11 w-32 rounded-full ${skeletonStyle}`} />
        <div className={`h-11 w-32 rounded-full ${skeletonStyle}`} />
      </div>
      <div className={`h-24 w-full ${skeletonStyle}`} />
      <div className={`h-32 w-full ${skeletonStyle}`} />
    </main>
  );
}
