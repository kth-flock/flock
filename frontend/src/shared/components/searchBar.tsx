"use client";

import { FieldWrapper } from "./formInputs";
import { useFocusWithin } from "../hooks/useFocusWithin";
import { FaMagnifyingGlass, FaX } from "react-icons/fa6";
import { useState } from "react";

type SearchBarProps = {
  onQueryChange?: (query: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  onQueryChange,
  placeholder = "Search...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const { ref, isFocused, focusWithinProps } =
    useFocusWithin<HTMLInputElement>();

  return (
    <FieldWrapper
      htmlFor="search"
      isFocused={isFocused}
      onClick={() => ref.current?.focus()}
      icon={<FaMagnifyingGlass />}
    >
      <div className="flex min-w-0 items-center gap-2">
        <input
          id="search"
          ref={ref}
          type="text"
          value={query}
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);
            onQueryChange?.(value);
          }}
          onFocus={focusWithinProps.onFocus}
          onBlur={focusWithinProps.onBlur}
          placeholder={placeholder}
          className="flock-body min-w-0 flex-1 border-0 bg-transparent p-0 outline-none placeholder:text-neutral"
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
            className="shrink-0 cursor-pointer text-primary hover:text-secondary"
          >
            <FaX aria-hidden="true" />
          </button>
        )}
      </div>
    </FieldWrapper>
  );
}
