import type { EventFormValues } from "@/features/event/lib/eventFormTypes";
import { useState } from "react";
import {
  formValuesToPayload,
  type EventPayloadMode,
} from "../lib/formValueFormat";
import { zodErrorsToRecord } from "@/shared/lib/zod";
import type { ZodType } from "zod";
import { getErrorMessage } from "@/shared/lib/errors";

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
        ...(parsed.success ? {} : zodErrorsToRecord(parsed.error)),
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
      setSubmitError(getErrorMessage(error, fallbackError));
      setIsSubmitting(false);
    }
  }

  return { values, errors, submitError, isSubmitting, setField, handleSubmit };
}
