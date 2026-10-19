import { twMerge } from "tailwind-merge";

export default function Skeleton({ className }: { className?: string }) {
    return (
      <div
        className={twMerge(
          "animate-pulse rounded-2xl bg-neutral/50",
          className,
        )}
      />
    );
  }