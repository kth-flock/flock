import { twMerge } from "tailwind-merge";

export default function SettingsSection({
  title,
  children,
  bordered = true,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  bordered?: boolean;
  className?: string;
}) {
  return (
    <section
      className={twMerge(
        "flex flex-col gap-2",
        bordered && "border-t border-primary/20 pt-4",
        className,
      )}
    >
      <h3 className="flock-h5 text-primary">{title}</h3>
      {children}
    </section>
  );
}
