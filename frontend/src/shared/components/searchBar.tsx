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
      <input
        id="search"
        ref={ref}
        type="search"
        value={query}
        onChange={(event) => {
          const value = event.target.value;
          setQuery(value);
          onQueryChange?.(value);
        }}
        onFocus={focusWithinProps.onFocus}
        onBlur={focusWithinProps.onBlur}
        placeholder={placeholder}
        className="flock-body w-full border-0 bg-transparent p-0 outline-none placeholder:text-neutral"
      />
    </FieldWrapper>
  );
}
