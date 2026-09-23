"use client";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "";
  className?: string;
  href?: string;
}

const baseStyle =
  "flex gap-4 rounded-full cursor-pointer disabled:pointer-events-none";

const buttonStyles = {
  primary:
    "bg-secondary text-white shadow-lg transition-all hover:shadow-md hover:-translate-y-0.5 hover:bg-primary active:translate-0 active:inset-shadow-sm active:shadow-none",
  secondary:
    "border-2 border-secondary text-secondary shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary/20 hover:border-primary hover:text-primary active:translate-0 active:inset-shadow-sm active:shadow-none active:bg-transparent",
  tertiary: "text-primary transition-all hover:underline disabled:opacity-50",
};

const getDisabledClasses = (disabled?: boolean) =>
  disabled ? "pointer-events-none opacity-50 shadow-none" : "";

const getButtonClasses = (
  variant?: ButtonProps["variant"],
  className?: string,
  disabled?: boolean,
) =>
  [
    "px-4 py-2",
    baseStyle,
    variant ? buttonStyles[variant] : "",
    className ?? "",
    getDisabledClasses(disabled),
  ]
    .filter(Boolean)
    .join(" ");

const getIconButtonClasses = (className?: string, disabled?: boolean) =>
  [
    "group p-4",
    baseStyle,
    buttonStyles.primary,
    className ?? "",
    getDisabledClasses(disabled),
  ]
    .filter(Boolean)
    .join(" ");

export default function Button({
  variant,
  className,
  href,
  children,
  disabled,
  ...props
}: ButtonProps) {
  if (href) {
    return (
      <Link
        href={href}
        onClick={(event) => {
          if (disabled) event.preventDefault();
        }}
        aria-disabled={disabled}
        className={getButtonClasses(variant, className, disabled)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      disabled={disabled}
      className={getButtonClasses(variant, className, disabled)}
      {...props}
    >
      {children}
    </button>
  );
}

interface IconButtonProps extends ButtonProps {
  ariaLabel: string;
  children: React.ReactElement;
}

export function IconButton({
  className,
  children,
  disabled,
  ariaLabel,
  href,
}: IconButtonProps) {
  const iconClasses =
    "group-hover:scale-110 group-hover:-rotate-7 group-active:scale-100 group-active:rotate-0";

  if (href) {
    return (
      <Link
        href={href}
        onClick={(event) => {
          if (disabled) event.preventDefault();
        }}
        aria-disabled={disabled}
        aria-label={ariaLabel}
        className={getIconButtonClasses(className, disabled)}
      >
        <span className={disabled ? "scale-100 rotate-0" : iconClasses}>
          {children}
        </span>
      </Link>
    );
  }

  return (
    <button
      disabled={disabled}
      aria-label={ariaLabel}
      className={getIconButtonClasses(className, disabled)}
    >
      <span className={disabled ? "scale-100 rotate-0" : iconClasses}>
        {children}
      </span>
    </button>
  );
}
