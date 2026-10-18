import LoginForm from "@/features/login/loginForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const token = (await cookies()).get("token")?.value;

  if (token) redirect("/");
  return (
    <div className="bg-accent/10 rounded-3xl p-8 flex flex-col gap-4 justify-center max-w-6xl">
      <LoginForm />
    </div>
  );
}
