import LoginSkeleton from "@/features/login/loginSkeleton";

export default function LoginLoading() {
  return (
    <div className="bg-accent/10 rounded-3xl p-8 flex flex-col gap-4 justify-center max-w-6xl">
      <LoginSkeleton />
    </div>
  );
}
