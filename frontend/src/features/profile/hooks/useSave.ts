import { useToast } from "@/shared/components/toast";
import { useState } from "react";

export function useSave() {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const toast = useToast();

  async function save(
    action: () => Promise<void>,
    successMessage: string,
    errorMessage: string,
  ) {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await action();

      toast(successMessage, "success");
    } catch (err) {
      setErrorMessage(
        err instanceof TypeError
          ? "Couldn't reach the server. Try again."
          : err instanceof Error
            ? err.message
            : "Something went wrong",
      );
      toast(errorMessage, "error");
    } finally {
      setIsSaving(false);
    }
  }

  return { save, isSaving, errorMessage, setErrorMessage };
}
