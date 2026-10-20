import { twMerge } from "tailwind-merge";
import { useFocusWithin } from "../hooks/useFocusWithin";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";

// TYPES

type FieldWrapperProps = {
  icon?: React.ReactElement;
  label?: string;
  required?: boolean;
  htmlFor?: string;
  isFocused: boolean;
  onClick: () => void;
  align?: "center" | "start";
  children: React.ReactNode;
  error?: string;
  size?: "default" | "compact";
  className?: string;
  disabled?: boolean;
};

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactElement;
  label?: string;
  error?: string;
};

type TextareaProps = TextareaAutosizeProps & {
  icon?: React.ReactElement;
  label?: string;
};

// COMPONENTS

export function FieldWrapper({
  icon,
  label,
  required = false,
  htmlFor,
  isFocused,
  onClick,
  align = "center",
  children,
  error,
  size = "default",
  className,
  disabled = false,
}: FieldWrapperProps) {
  const isCompact = size === "compact";

  return (
    <div className={twMerge("flex w-full flex-col gap-1", className)}>
      <div
        onClick={disabled ? undefined : onClick}
        className={twMerge(
          "flex w-full cursor-text border bg-background transition-colors hover:border-primary",
          isCompact
            ? "items-center gap-2 rounded-full border-transparent px-3 py-2.5 shadow-none"
            : "gap-3 rounded-2xl px-4 py-3 md:gap-4 md:px-6 md:py-4",
          !isCompact &&
            (align === "center" ? "items-center" : "items-start"),
          isFocused
            ? isCompact
              ? "border-secondary"
              : "border-secondary shadow-md"
            : !isCompact && "border-primary/20",
          error && "border-error",
          disabled && "cursor-not-allowed opacity-60 hover:border-primary/20",
        )}
      >
        {icon && (
          <span
            className={twMerge(
              "shrink-0 text-primary",
              isCompact ? "text-sm" : align === "start" && "pt-1",
            )}
          >
            {icon}
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col ">
          {label && (
            <label
              htmlFor={htmlFor}
              className="flock-h6 font-bold! leading-none text-primary w-fit text-nowrap"
            >
              {label}
              {required && <span className="text-error"> *</span>}
            </label>
          )}

          {children}
        </div>
      </div>
      {error && (
        <p className="flock-ui-label text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Input({
  icon,
  label,
  required = false,
  placeholder,
  className,
  onFocus,
  onBlur,
  type = "text",
  error,
  ...props
}: InputProps) {
  const { ref, isFocused, focusWithinProps } =
    useFocusWithin<HTMLInputElement>();

  const showPickerIfSupported = () => {
    if (type === "date" || type === "time" || type === "datetime-local") {
      try {
        ref.current?.showPicker?.();
      } catch {}
    }
  };

  return (
    <FieldWrapper
      icon={icon}
      label={label}
      required={required}
      htmlFor={props.id}
      isFocused={isFocused}
      error={error}
      disabled={props.disabled}
      onClick={() => {
        ref.current?.focus();
        showPickerIfSupported();
      }}
    >
      <input
        {...props}
        ref={ref}
        type={type}
        placeholder={placeholder}
        onFocus={(e) => {
          focusWithinProps.onFocus();
          onFocus?.(e);
        }}
        onBlur={(e) => {
          focusWithinProps.onBlur();
          onBlur?.(e);
        }}
        className={twMerge(
          "w-full border-0 bg-transparent p-0 flock-body outline-none placeholder:text-neutral disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:hidden",
          className,
        )}
        autoComplete="off"
      />
    </FieldWrapper>
  );
}

export function TextArea({
  icon,
  label,
  placeholder = "Add details",
  className,
  onFocus,
  onBlur,
  rows = 4,
  ...props
}: TextareaProps) {
  const { ref, isFocused, focusWithinProps } =
    useFocusWithin<HTMLTextAreaElement>();

  return (
    <FieldWrapper
      icon={icon}
      label={label}
      htmlFor={props.id}
      isFocused={isFocused}
      align="center"
      onClick={() => ref.current?.focus()}
    >
      <TextareaAutosize
        {...props}
        ref={ref}
        placeholder={placeholder}
        rows={rows}
        onFocus={(e) => {
          focusWithinProps.onFocus();
          onFocus?.(e);
        }}
        onBlur={(e) => {
          focusWithinProps.onBlur();
          onBlur?.(e);
        }}
        className={twMerge(
          "w-full max-w-none! resize-none border-0 bg-transparent p-0 flock-body outline-none placeholder:text-neutral",
          className,
        )}
      />
    </FieldWrapper>
  );
}
