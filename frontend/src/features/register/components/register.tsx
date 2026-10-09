"use client";

import { useState } from "react";

import Button from "@/shared/components/button";
import Input from "@/shared/components/formInputs";
import ImageUpload from "@/shared/components/imageUpload";
import {
  RegisterUserDraft,
  registerUserFormSchema,
} from "../types/registerTypes";
import { registerFetch } from "@/shared/lib/api";

export default function Register() {
  const [validationError, setValidationError] = useState<
    Record<string, string>
  >({});

  const [submitError, setSubmitError] = useState<string | null>(null);

  const [registerDraft, setRegisterDraft] = useState<RegisterUserDraft>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleInputChange<Key extends keyof RegisterUserDraft>(
    field: Key,
    value: RegisterUserDraft[Key],
  ) {
    setRegisterDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function validateFields(payload: unknown) {
    const result = registerUserFormSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors = result.error.issues.reduce<Record<string, string>>(
        (errors, issue) => {
          const field = issue.path.join(".") || "form";

          errors[field] ??= issue.message;

          return errors;
        },
        {},
      );

      setValidationError(fieldErrors);

      return null;
    }

    setValidationError({});

    return result.data;
  }

  async function handleSubmitRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload = validateFields({
      firstName: registerDraft.firstName,
      lastName: registerDraft.lastName,
      email: registerDraft.email,
      password: registerDraft.password,
      confirmPassword: registerDraft.confirmPassword,
    });

    if (!payload) return;

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await registerFetch({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: payload.password,
      });

      //TODO: what happens when you successfully register
    } catch (error) {
      setSubmitError(
        error instanceof TypeError
          ? "Couldn't connect to the server. Check your connection and try again."
          : error instanceof Error
            ? error.message
            : "Couldn't register your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <>
      <h1 className="flock-h1 text-center">Register</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmitRegister}>
        <div className="flex flex-col gap-4 md:flex-row">
          <Input
            id="firstName"
            name="firstName"
            label="First name"
            placeholder="First name"
            required
            autoComplete="given-name"
            value={registerDraft.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            error={validationError["firstName"] ?? ""}
          />

          <Input
            id="lastName"
            name="lastName"
            label="Last name"
            placeholder="Last name"
            required
            autoComplete="family-name"
            value={registerDraft.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            error={validationError["lastName"] ?? ""}
          />
        </div>

        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="Email"
          required
          autoComplete="email"
          value={registerDraft.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          error={validationError["email"] ?? ""}
        />

        <div className="flex flex-col gap-4 md:flex-row">
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Password"
            required
            autoComplete="new-password"
            value={registerDraft.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={validationError["password"] ?? ""}
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm password"
            placeholder="Confirm password"
            required
            autoComplete="new-password"
            value={registerDraft.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            error={validationError["confirmPassword"] ?? ""}
          />
        </div>

        {submitError && (
          <p className="flock-ui-label text-error" role="alert">
            {submitError}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>
    </>
  );
}
