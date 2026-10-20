import { twMerge } from "tailwind-merge";

export default function OngoingPill({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <span
      className={twMerge(
        "inline-flex w-fit items-center rounded-full bg-warn-light text-warn-dark! ring-[1.5px] ring-current",
        size === "sm"
          ? "gap-1 px-2 py-0.5 flock-caption"
          : "gap-1.5 px-3 py-1 flock-body-sm",
      )}
    >
      <span
        aria-hidden
        className={twMerge(
          "rounded-full bg-current motion-safe:animate-pulse",
          size === "sm" ? "size-1.5" : "size-2",
        )}
      />
      Ongoing
    </span>
  );
}
