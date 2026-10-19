"use client";

import { useEffect, useState } from "react";
import { FaCheck, FaLink } from "react-icons/fa6";
import { IconButton } from "@/shared/components/button";

const COPIED_MESSAGE_MS = 2000;

export default function CopyProfileLink({ profileId }: { profileId: number }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timeout = setTimeout(() => setStatus("idle"), COPIED_MESSAGE_MS);
    return () => clearTimeout(timeout);
  }, [status]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/profile/${profileId}`,
      );
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="flex items-center gap-2">
      {status !== "idle" && (
        <span
          role="status"
          className="flock-caption rounded-full bg-black/40 px-2 py-0.5 text-white!"
        >
          {status === "copied" ? "Link copied" : "Couldn't copy link"}
        </span>
      )}
      <IconButton
        size="sm"
        aria-label="Copy link to profile"
        className="bg-white/15 text-white shadow-none hover:bg-white/25"
        onClick={handleCopy}
      >
        {status === "copied" ? <FaCheck /> : <FaLink />}
      </IconButton>
    </div>
  );
}
