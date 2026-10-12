import LoginForm from "@/features/login/loginForm";

export default function LoginPage() {
  // TODO: Add check if user is already logged in

  return (
    <main className="bg-accent/10 rounded-3xl p-8 flex flex-col gap-4 justify-center max-w-6xl">
      <LoginForm />
    </main>
  );
}
