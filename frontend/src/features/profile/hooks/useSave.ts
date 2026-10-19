import { useState } from "react";
import { getErrorMessage } from "@/shared/lib/errors";

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
        message: getErrorMessage(err, "Couldn't save. Try again."),
      });
    } finally {
      setIsSaving(false);
    }
  }

  return { save, isSaving, result, setResult };
}
