import { useState } from "react";
import { useEventForm } from "../hooks/useEventForm";
import EventImageField from "./eventImageField";
import EventFormFields from "@/features/event-form/components/eventFormFields";
import Button from "@/shared/components/button";
import type { EventFormValues } from "@/features/event/lib/eventFormTypes";
import type { EventPayloadMode } from "../lib/formValueFormat";
import type { ZodType } from "zod";
import { useToast } from "@/shared/components/toast";

type Props<TPayload> = {
  heading?: string;
  submitLabel: string;
  cancelHref: string;
  initialValues: EventFormValues;
  mode: EventPayloadMode;
  currentImageUrl?: string | null;
  schema: ZodType<TPayload>;
  fallbackError: string;
  successMessage: string;
  onSubmit: (payload: TPayload, imageFile: File | null) => Promise<void>;
};

export default function EventForm<TPayload>({
  heading,
  submitLabel,
  cancelHref,
  initialValues,
  mode,
  currentImageUrl,
  schema,
  fallbackError,
  successMessage,
  onSubmit,
}: Props<TPayload>) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const toast = useToast();
  const form = useEventForm({
    initialValues,
    mode,
    schema,
    fallbackError,
    onSubmit: async (payload) => {
      await onSubmit(payload, imageFile);
      toast(successMessage, "success");
    },
  });

  return (
    <form className="flex flex-col gap-2 md:gap-4" onSubmit={form.handleSubmit}>
      {heading && <h1 className="flock-h1 text-center">{heading}</h1>}
      <EventImageField
        currentImageUrl={currentImageUrl}
        onChange={setImageFile}
      />
      <EventFormFields
        values={form.values}
        errors={form.errors}
        onChange={form.setField}
      />
      {form.submitError && (
        <p className="flock-ui-label text-error" role="alert">
          {form.submitError}
        </p>
      )}
      <div className="w-full flex justify-between">
        <Button type="button" variant="secondary" href={cancelHref}>
          Cancel
        </Button>
        <Button type="submit" disabled={form.isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
