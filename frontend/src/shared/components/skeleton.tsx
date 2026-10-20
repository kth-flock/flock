import { twMerge } from "tailwind-merge";
import { ReactNode } from "react";

export default function Skeleton({ className, children }: { className?: string, children?: ReactNode }) {
    return (
      <div
        className={twMerge(
          "animate-pulse rounded-2xl bg-neutral/50",
          className,
        )}
      >
        {children}
      </div>
    );
  }