import Button from "./button";

type LoadErrorProps = {
  children: React.ReactNode;
  onRetry?: () => void;
};

export default function LoadError({ children, onRetry }: LoadErrorProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-error/60 p-6 text-center"
    >
      <p className="flock-body-sm text-error">{children}</p>
      {onRetry && (
        <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
