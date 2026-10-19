"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/shared/components/button";
import Input from "@/shared/components/formInputs";
import {
  RegisterUserDraft,
  registerUserFormSchema,
} from "../types/registerTypes";
import { useAuth } from "@/shared/auth/authContext";
import Link from "next/link";
import { useToast } from "@/shared/components/toast";
import { getErrorMessage } from "@/shared/lib/errors";

export default function RegisterForm() {
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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { register } = useAuth();
  const toast = useToast();

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
      await register({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: payload.password,
      });
      router.push("/");
      toast("Welcome to Flock!", "info");
    } catch (error) {
      setSubmitError(
        getErrorMessage(
          error,
          "Couldn't register your account. Please try again.",
        ),
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
          placeholder="email@example.com"
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
            placeholder="••••••••"
            required
            autoComplete="off"
            value={registerDraft.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={validationError["password"] ?? ""}
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm password"
            placeholder="••••••••"
            required
            autoComplete="off"
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
          isLoading={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>
      <span className="inline-flex gap-2 items-center flock-body justify-center">
        Already have an account?
        <Link
          href="/login"
          className="text-secondary font-semibold! hover:underline "
        >
          Log in
        </Link>
      </span>
    </>
  );
}
