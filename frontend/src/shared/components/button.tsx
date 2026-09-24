"use client";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

// TODO: button-types, sizes + responsivity

// ---------- TYPES ----------

type ButtonVariant = "primary" | "secondary" | "tertiary";

type IconPlacement = "left" | "right" | "";

type ClickableItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
};

type ButtonProps =
  | (ClickableItemProps & {
      variant?: ButtonVariant;
      icon?: undefined;
      iconPlacement?: undefined;
    })
  | (ClickableItemProps & {
      variant?: ButtonVariant;
      icon: React.ReactElement;
      iconPlacement: IconPlacement;
    });

type IconButtonProps = ClickableItemProps;

// ---------- STYLE CLASSES ----------

const baseStyle =
  "flex gap-1 items-center rounded-full cursor-pointer disabled:pointer-events-none";

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-secondary text-white shadow-lg transition-all hover:shadow-md hover:-translate-y-0.5 hover:bg-primary active:translate-y-0 active:inset-shadow-sm active:shadow-none",
  secondary:
    "border-2 border-secondary text-secondary shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary/20 hover:border-primary hover:text-primary active:translate-y-0 active:inset-shadow-sm active:shadow-none active:bg-transparent",
  tertiary: "text-primary transition-all hover:underline disabled:opacity-50",
};

const iconHoverClasses =
  "group-hover:scale-110 group-hover:-rotate-[7deg] group-active:scale-100 group-active:rotate-0";

// ---------- HELPER FUNCTIONS ----------

const getDisabledClasses = (disabled?: boolean) =>
  disabled ? "pointer-events-none opacity-50 shadow-none" : "";

const getButtonClasses = ({
  variant = "primary",
  className,
  disabled,
  iconPlacement,
}: {
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
  iconPlacement?: IconPlacement;
}) =>
  twMerge(
    iconPlacement
      ? iconPlacement == "left"
        ? "pr-4 pl-3 py-2 flex-row-reverse"
        : "pr-3 pl-4 py-2"
      : "px-4 py-2",
    baseStyle,
    buttonStyles[variant],
    getDisabledClasses(disabled),
    className,
  );

const getIconButtonClasses = ({
  className,
  disabled,
}: {
  className?: string;
  disabled?: boolean;
}) =>
  twMerge(
    "group p-4",
    baseStyle,
    buttonStyles.primary,
    getDisabledClasses(disabled),
    className,
  );

// ---------- COMPONENTS ----------

export function ClickableItem({
  href,
  disabled,
  className,
  children,
  "aria-label": ariaLabel,
  onClick,
}: ClickableItemProps) {
  return href ? (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
      }}
      aria-disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  ) : (
    <button
      disabled={disabled}
      aria-label={ariaLabel}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function Button({
  variant,
  className,
  href,
  children,
  disabled,
  onClick,
  "aria-label": ariaLabel,
  icon,
  iconPlacement = "",
}: ButtonProps) {
  return (
    <ClickableItem
      href={href}
      disabled={disabled}
      onClick={onClick}
      className={getButtonClasses({
        variant,
        className,
        disabled,
        iconPlacement,
      })}
      aria-label={ariaLabel}
    >
      {children}
      {icon}
    </ClickableItem>
  );
}

export function IconButton({
  className,
  children,
  disabled,
  "aria-label": ariaLabel,
  href,
  onClick,
}: IconButtonProps) {
  return (
    <ClickableItem
      href={href}
      disabled={disabled}
      onClick={onClick}
      className={getIconButtonClasses({ className, disabled })}
      aria-label={ariaLabel}
    >
      <span className={disabled ? "scale-100 rotate-0" : iconHoverClasses}>
        {children}
      </span>
    </ClickableItem>
  );
}
