import type { EventFormValues } from "@/features/event/lib/eventFormTypes";
import { useState } from "react";
import {
  formValuesToPayload,
  type EventPayloadMode,
} from "../lib/formValueFormat";
import { getFieldErrors } from "@/features/event/lib/eventFormFieldsUtils";
import type { ZodType } from "zod";
import { getErrorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/components/toast";

export function useEventForm<TPayload>({
  initialValues,
  mode,
  schema,
  onSubmit,
  fallbackError,
}: {
  initialValues: EventFormValues;
  mode: EventPayloadMode;
  schema: ZodType<TPayload>;
  onSubmit: (payload: TPayload) => Promise<void>;
  fallbackError: string;
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  function setField<K extends keyof EventFormValues>(
    field: K,
    value: EventFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    const { errors: dateErrors, payload } = formValuesToPayload(values, mode);
    const parsed = schema.safeParse(payload);

    if (Object.keys(dateErrors).length || !parsed.success) {
      setErrors({
        ...(parsed.success ? {} : getFieldErrors(parsed.error.issues)),
        ...dateErrors,
      });
      return;
    }

    setErrors({});
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(parsed.data);
    } catch (error) {
      const message = getErrorMessage(error, fallbackError);
      setSubmitError(message);
      toast(message, "error");
      setIsSubmitting(false);
    }
  }

  return { values, errors, submitError, isSubmitting, setField, handleSubmit };
}
