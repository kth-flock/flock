"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { debounce, type DebounceSettings } from "lodash";

type SearchCallback<TArgs extends unknown[]> = (
  ...args: [...TArgs, isCurrent: () => boolean]
) => void | Promise<void>;

type PendingSearch<TArgs extends unknown[]> = {
  args: TArgs;
  requestId: number;
};

export function useDebouncedSearch<TArgs extends unknown[]>(
  callback: SearchCallback<TArgs>,
  wait: number,
  options?: DebounceSettings,
) {
  const callbackRef = useRef(callback);
  const requestIdRef = useRef(0);
  callbackRef.current = callback;

  const debouncedSearch = useMemo(
    () =>
      debounce(({ args, requestId }: PendingSearch<TArgs>) => {
        void callbackRef.current(
          ...args,
          () => requestId === requestIdRef.current,
        );
      }, wait, options),
    [wait, options?.leading, options?.trailing, options?.maxWait],
  );

  const search = useCallback(
    (...args: TArgs) => {
      const requestId = ++requestIdRef.current;
      debouncedSearch({ args, requestId });
    },
    [debouncedSearch],
  );

  const cancel = useCallback(() => {
    requestIdRef.current += 1;
    debouncedSearch.cancel();
  }, [debouncedSearch]);

  useEffect(() => cancel, [cancel]);

  return { search, cancel };
}
