import { twMerge } from "tailwind-merge";
import Button from "./button";
import Image from "next/image";
type ErrorStateProps = {
  title: string;
  message: string;
  variant?: "error" | "not-found";
  action?: { label: string; onClick?: () => void; href?: string };
};

export default function ErrorState({
  title,
  message,
  variant = "error",
  action,
}: ErrorStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <Image src="/error-logo.svg" alt="Error Logo" aria-hidden="true" width={100} height={100} />
      <h1
        className={twMerge(
          "flock-h1",
          variant === "not-found" ? "text-primary" : "text-error",
        )}
      >
        {title}
      </h1>
      <p className="flock-body text-foreground/70">{message}</p>
      {action && (
        <Button onClick={action.onClick} href={action.href}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

