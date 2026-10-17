"use client";

import { useState } from "react";
import { FaUserPlus } from "react-icons/fa6";
import Button from "@/shared/components/button";
import type { PublicUser } from "@/shared/types/user";
import InviteModal from "./inviteModal";

export default function InviteButton({
  invitees,
  eventId,
  onChange,
}: {
  invitees: PublicUser[];
  eventId: number;
  onChange: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <InviteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        invitees={invitees}
        eventId={eventId}
        onChange={onChange}
      />
      <Button
        icon={<FaUserPlus aria-hidden />}
        iconPlacement="right"
        variant="secondary"
        onClick={() => setIsModalOpen(true)}
      >
        Invite
      </Button>
    </>
  );
}
