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
}: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div
        onClick={onClick}
        className={twMerge(
          "flex w-full cursor-text gap-3 md:gap-4 rounded-2xl border bg-white px-4 py-3 md:px-6 md:py-4 transition-colors hover:border-primary",
          align === "center" ? "items-center" : "items-start",
          isFocused ? "border-secondary shadow-md" : "border-primary/20",
          error && "border-error",
        )}
      >
        {icon && (
          <span
            className={twMerge("text-primary", align === "start" && "pt-1")}
          >
            {icon}
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          {label && (
            <label
              htmlFor={htmlFor}
              className="flock-h6 font-bold! leading-none text-primary w-fit"
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
          "w-full border-0 bg-transparent p-0 flock-body outline-none placeholder:text-neutral [&::-webkit-calendar-picker-indicator]:hidden",
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
