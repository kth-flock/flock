export type DebouncedFunction<Args extends unknown[]> = ((
  ...args: Args
) => void) & { cancel: () => void };

export function debounce<Args extends unknown[]>(
  callback: (...args: Args) => void | Promise<void>,
  delay = 500,
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = ((...args: Args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      void callback(...args);
    }, delay);
  }) as DebouncedFunction<Args>;

  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}
