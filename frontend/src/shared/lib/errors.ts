export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof TypeError)
    return "Couldn't connect to the server. Check your connection and try again.";
  return error instanceof Error ? error.message : fallback;
}
