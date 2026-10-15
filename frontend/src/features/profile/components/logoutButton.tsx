"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaRightFromBracket } from "react-icons/fa6";
import Button from "@/shared/components/button";
import { useAuth } from "@/shared/auth/authContext";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    setIsLoggingOut(true);
    setError(null);
    try {
      await logout();
      router.push("/");
      router.refresh();
    } catch {
      setError("Couldn't log out. Try again.");
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        icon={<FaRightFromBracket />}
        iconPlacement="left"
        disabled={isLoggingOut}
        onClick={handleLogout}
        className="bg-error/60 text-white hover:bg-error/40"
      >
        {isLoggingOut ? "Logging out..." : "Log out"}
      </Button>
      {error && (
        <p className="flock-caption text-white!" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
