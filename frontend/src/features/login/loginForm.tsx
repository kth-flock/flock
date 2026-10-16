"use client";
import Input from "@/shared/components/formInputs";
import Button from "@/shared/components/button";
import { useState } from "react";
import { loginUserSchema, LoginUser } from "@flock/shared/schemas/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/auth/authContext";
import Link from "next/link";

export default function LoginForm() {
  const [validationError, setValidationError] = useState<
    Record<string, string>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  function validateFields(payload: LoginUser) {
    const result = loginUserSchema.safeParse(payload);

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

  async function handelLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload = validateFields({
      email: email,
      password: password,
    });

    if (!payload) return;

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await login(payload);
      router.push("/");
    } catch (error) {
      setSubmitError(
        error instanceof TypeError
          ? "Couldn't connect to the server. Check your connection and try again."
          : error instanceof Error
            ? error.message
            : "Couldn't log into your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="flock-h1 text-center">Log in</h1>
      <form className="flex flex-col gap-4" onSubmit={handelLogin}>
        <div className="flex flex-col gap-4 md:min-w-lg">
          <Input
            id="email"
            name="email"
            label="Email"
            placeholder="email@example.com"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={validationError["email"] ?? ""}
          />

          <Input
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={validationError["password"] ?? ""}
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
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </form>
      <span className="inline-flex gap-2 items-center flock-body justify-center">
        New to flock?
        <Link
          href="/register"
          className="text-secondary font-semibold! hover:underline "
        >
          Register here
        </Link>
      </span>
    </>
  );
}
