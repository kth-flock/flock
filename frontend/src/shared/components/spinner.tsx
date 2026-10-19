export default function Spinner({ className = "" }: { className?: string }) {
  const variant = "border-neutral border-t-primary";

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`animate-spin rounded-full border-2 ${variant}  ${className}`}
    />
  );
}
