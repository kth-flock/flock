"use client";

import { FieldWrapper } from "./formInputs";
import { useFocusWithin } from "../hooks/useFocusWithin";
import { FaMagnifyingGlass, FaX } from "react-icons/fa6";
import { useState, type ReactElement } from "react";
import { twMerge } from "tailwind-merge";

type SearchBarProps = {
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  id?: string;
  icon?: ReactElement;
  className?: string;
  size?: "default" | "compact";
};

export default function SearchBar({
  onQueryChange,
  placeholder = "Search...",
  autoFocus = false,
  id = "search",
  icon = <FaMagnifyingGlass />,
  className,
  size = "default",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const { ref, isFocused, focusWithinProps } =
    useFocusWithin<HTMLInputElement>();

  return (
    <FieldWrapper
      htmlFor={id}
      isFocused={isFocused}
      onClick={() => ref.current?.focus()}
      icon={icon}
      size={size}
      className={className}
    >
      <div className="flex min-w-0 items-center gap-2">
        <input
          id={id}
          ref={ref}
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);
            onQueryChange?.(value);
          }}
          onFocus={focusWithinProps.onFocus}
          onBlur={focusWithinProps.onBlur}
          placeholder={placeholder}
          className={twMerge(
            "min-w-0 flex-1 border-0 bg-transparent p-0 outline-none placeholder:text-neutral",
            size === "compact" ? "flock-caption" : "flock-body",
          )}
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            title="Clear search"
            onClick={() => {
              setQuery("");
              onQueryChange?.("");
              ref.current?.focus();
            }}
            className={twMerge(
              "shrink-0 cursor-pointer text-primary hover:text-secondary",
              size === "compact" ? "text-xs" : "",
            )}
          >
            <FaX aria-hidden="true" />
          </button>
        )}
      </div>
    </FieldWrapper>
  );
}
