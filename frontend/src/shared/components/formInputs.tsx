import { twMerge } from "tailwind-merge";
import { useFocusWithin } from "../hooks/useFocusWithin";

// TYPES

type FieldWrapperProps = {
  icon?: React.ReactElement;
  label?: string;
  htmlFor?: string;
  isFocused: boolean;
  onClick: () => void;
  align?: "center" | "start";
  children: React.ReactNode;
};

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactElement;
  label?: string;
};

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  icon?: React.ReactElement;
  label?: string;
};

// COMPONENTS

export function FieldWrapper({
  icon,
  label,
  htmlFor,
  isFocused,
  onClick,
  align = "center",
  children,
}: FieldWrapperProps) {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        "flex w-full cursor-text gap-4 rounded-2xl border bg-white px-6 py-4 transition-colors hover:border-primary",
        align === "center" ? "items-center" : "items-start",
        isFocused ? "border-secondary shadow-md" : "border-primary/20",
      )}
    >
      {icon && (
        <span className={twMerge("text-primary", align === "start" && "pt-1")}>
          {icon}
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        {label && (
          <label
            htmlFor={htmlFor}
            className="h6 font-bold! leading-none text-primary w-fit"
          >
            {label}
          </label>
        )}
        {children}
      </div>
    </div>
  );
}

export default function Input({
  icon,
  label = "Event title",
  placeholder = "Title",
  className,
  onFocus,
  onBlur,
  type = "text",
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
      htmlFor={props.id}
      isFocused={isFocused}
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
          showPickerIfSupported();
          onFocus?.(e);
        }}
        onBlur={(e) => {
          focusWithinProps.onBlur();
          onBlur?.(e);
        }}
        className={twMerge(
          "w-full border-0 bg-transparent p-0 body outline-none placeholder:text-neutral [&::-webkit-calendar-picker-indicator]:hidden",
          className,
        )}
      />
    </FieldWrapper>
  );
}

export function TextArea({
  icon,
  label = "Description",
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
      align="start"
      onClick={() => ref.current?.focus()}
    >
      <textarea
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
          "w-full resize-none border-0 bg-transparent p-0 body outline-none placeholder:text-neutral",
          className,
        )}
      />
    </FieldWrapper>
  );
}
