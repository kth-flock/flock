import { useState } from "react";

export type Result = { ok: boolean; message: string };

export function useSave() {
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function save(action: () => Promise<void>, successMessage: string) {
    setIsSaving(true);
    setResult(null);
    try {
      await action();
      setResult({ ok: true, message: successMessage });
    } catch (err) {
      setResult({
        ok: false,
        message:
          err instanceof TypeError
            ? "Couldn't reach the server. Try again."
            : err instanceof Error
              ? err.message
              : "Something went wrong",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return { save, isSaving, result, setResult };
}
