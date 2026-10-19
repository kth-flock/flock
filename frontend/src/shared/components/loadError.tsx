export default function LoadError({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-2xl border-2 border-dashed border-error/60 p-6 text-center flock-body-sm text-error"
    >
      {children}
    </p>
  );
}
