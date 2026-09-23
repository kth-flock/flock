import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "";
  className?: string;
  href?: string;
}

const baseStyle =
  "flex gap-4 rounded-full px-4 py-2 cursor-pointer disabled:pointer-events-none";

const buttonStyles = {
  primary:
    "bg-secondary text-white shadow-lg transition-all hover:shadow-md hover:-translate-y-0.5 hover:bg-primary active:translate-0 active:inset-shadow-sm active:shadow-none disabled:shadow-none disabled:opacity-50",
  secondary:
    "border-2 border-secondary text-secondary shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary/20 hover:border-primary hover:text-primary active:translate-0 active:inset-shadow-sm active:shadow-none active:bg-transparent disabled:opacity-50",
  tertiary: "text-primary transition-all hover:underline disabled:opacity-50",
};

export default function Button({
  variant,
  className,
  href,
  children,
  disabled,
}: ButtonProps) {
  return href ? (
    <Link
      href={href}
      aria-disabled={disabled}
      className={`${baseStyle} ${variant && buttonStyles[variant]} ${className ?? ""}`}
    >
      {children}
    </Link>
  ) : (
    <button
      disabled={disabled}
      className={`${baseStyle} ${variant && buttonStyles[variant]} ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
