import type { ReactNode } from "react";
import RequireAuth from "@/shared/auth/requireAuth";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
