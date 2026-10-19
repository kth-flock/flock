import { twMerge } from "tailwind-merge";

export default function DayNumber({
  day,
  isToday,
  className,
}: {
  day: Date;
  isToday: boolean;
  className?: string;
}) {
  return (
    <span
      className={twMerge(
        "relative flex shrink-0 items-center justify-center leading-none",
        isToday && "font-bold",
        className,
      )}
    >
      {isToday && (
        <span className="absolute inset-0 rounded-full bg-secondary/50" />
      )}
      <span className="relative">{day.getDate()}</span>
    </span>
  );
}
