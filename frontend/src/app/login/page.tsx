"use client";

import { redirect } from "next/navigation";
import LoginForm from "@/features/login/loginForm";
import LoginSkeleton from "@/features/login/loginSkeleton";
import { useAuth } from "@/shared/auth/authContext";

export default function LoginPage() {
  const { user } = useAuth();

  if (user === undefined) {
    return (
      <div className="bg-accent/10 rounded-3xl p-8 flex flex-col gap-4 justify-center max-md:w-full max-w-6xl">
        <LoginSkeleton />
      </div>
    );
  }
  if (user) redirect("/");

  return (
    <div className="bg-accent/10 rounded-3xl p-8 flex flex-col gap-4 justify-center max-md:w-full max-w-6xl">
      <LoginForm />
    </div>
  );
}
