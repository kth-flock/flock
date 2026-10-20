"use client";

import { redirect } from "next/navigation";
import RegisterForm from "@/features/register/components/registerForm";
import RegisterSkeleton from "@/features/register/components/registerSkeleton";
import { useAuth } from "@/shared/auth/authContext";

export default function RegisterPage() {
  const { user } = useAuth();

  if (user === undefined) {
    return (
      <div className="bg-accent/10 rounded-3xl p-8 flex flex-col gap-4 justify-center max-w-6xl">
        <RegisterSkeleton />
      </div>
    );
  }
  if (user) redirect("/");

  return (
    <div className="bg-accent/10 rounded-3xl p-8 flex flex-col gap-4 justify-center max-w-6xl">
      <RegisterForm />
    </div>
  );
}
