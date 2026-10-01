"use client";
import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa6";
import Button from "@/shared/components/button";
import Input from "@/shared/components/formInputs";

export default function ReplyForm({
  announcementId,
}: {
  announcementId: number;
}) {
  const [reply, setReply] = useState("");
  const inputId = `reply-${announcementId}`;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!reply.trim()) return;

    // TODO: post reply as comment on announcement once endpoint is in place
    setReply("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <Input
        id={inputId}
        aria-label="Write a reply"
        placeholder="Write a reply"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        className="-my-2"
      />
      <Button
        type="submit"
        icon={<FaPaperPlane />}
        iconPlacement="left"
        disabled={!reply.trim()}
        className="shrink-0"
      >
        Reply
      </Button>
    </form>
  );
}
