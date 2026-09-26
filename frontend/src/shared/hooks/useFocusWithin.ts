"use client";

import { useRef, useState } from "react";

export function useFocusWithin<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isFocused, setIsFocused] = useState(false);

  const focusWithinProps = {
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  };

  return { ref, isFocused, focusWithinProps };
}
