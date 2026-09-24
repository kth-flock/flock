"use client";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

// ---------- TYPES ----------

type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonSize = "sm" | "md" | "lg";
type IconPlacement = "left" | "right" | "";

type ClickableItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
};

type ButtonProps =
  | (ClickableItemProps & {
      variant?: ButtonVariant;
      size?: ButtonSize;
      icon?: undefined;
      iconPlacement?: undefined;
    })
  | (ClickableItemProps & {
      variant?: ButtonVariant;
      size?: ButtonSize;
      icon: React.ReactElement;
      iconPlacement: IconPlacement;
    });

type IconButtonProps = ClickableItemProps & {
  size?: ButtonSize;
};

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

const buttonSizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1",
  md: "px-4 py-2 text-base gap-1.5",
  lg: "px-5 py-2.5 text-base gap-2",
};

const buttonSizeIconStyles: Record<
  ButtonSize,
  Record<"left" | "right", string>
> = {
  sm: {
    left: "pl-2.5 pr-3 py-1.5 text-sm gap-1 flex-row-reverse",
    right: "pl-3 pr-2.5 py-1.5 text-sm gap-1",
  },
  md: {
    left: "pl-3 pr-4 py-2 text-base gap-1.5 flex-row-reverse",
    right: "pl-4 pr-3 py-2 text-base gap-1.5",
  },
  lg: {
    left: "pl-4 pr-5 py-2.5 text-base gap-2 flex-row-reverse",
    right: "pl-5 pr-4 py-2.5 text-base gap-2",
  },
};

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: "[&>svg]:size-4",
  md: "[&>svg]:size-5",
  lg: "[&>svg]:size-6",
};

const iconButtonSizeStyles: Record<ButtonSize, string> = {
  sm: "p-2 [&>svg]:size-4",
  md: "p-3 [&>svg]:size-5",
  lg: "p-4 [&>svg]:size-6",
};

const iconHoverClasses =
  "group-hover:scale-110 group-hover:-rotate-[7deg] group-active:scale-100 group-active:rotate-0";

// ---------- HELPER FUNCTIONS ----------

const getDisabledClasses = (disabled?: boolean) =>
  disabled ? "pointer-events-none opacity-50 shadow-none" : "";

const getButtonClasses = ({
  variant = "primary",
  size = "md",
  className,
  disabled,
  iconPlacement,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  iconPlacement?: IconPlacement;
}) =>
  twMerge(
    iconPlacement
      ? buttonSizeIconStyles[size][iconPlacement === "left" ? "left" : "right"]
      : buttonSizeStyles[size],
    baseStyle,
    buttonStyles[variant],
    getDisabledClasses(disabled),
    className,
  );

const getIconButtonClasses = ({
  size = "md",
  className,
  disabled,
}: {
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
}) =>
  twMerge(
    "group",
    iconButtonSizeStyles[size],
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
  type,
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
      type={type}
    >
      {children}
    </button>
  );
}

export default function Button({
  variant,
  size = "md",
  className,
  children,
  disabled,
  icon,
  iconPlacement = "",
  ...props
}: ButtonProps) {
  return (
    <ClickableItem
      disabled={disabled}
      className={getButtonClasses({
        variant,
        size,
        className,
        disabled,
        iconPlacement,
      })}
      {...props}
    >
      {children}
      {icon && <span className={iconSizeStyles[size]}>{icon}</span>}
    </ClickableItem>
  );
}

export function IconButton({
  size = "md",
  className,
  children,
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <ClickableItem
      disabled={disabled}
      className={getIconButtonClasses({ size, className, disabled })}
      {...props}
    >
      <span className={disabled ? "scale-100 rotate-0" : iconHoverClasses}>
        {children}
      </span>
    </ClickableItem>
  );
}
