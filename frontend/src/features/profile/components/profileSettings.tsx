"use client";

import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { FaGear } from "react-icons/fa6";
import Button from "@/shared/components/button";
import Modal from "@/shared/components/modal";
import { PrivateUser } from "@/shared/types/user";
import ProfileForm from "./profileForm";
import EmailForm from "./emailForm";
import PasswordForm from "./passwordForm";
import DangerZone from "./dangerZone";

export default function ProfileSettings({
  profile,
  email,
}: {
  profile: PrivateUser;
  email: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        icon={<FaGear />}
        iconPlacement="left"
        className="bg-white/15 text-white hover:bg-white/25"
        onClick={() => setIsOpen(true)}
      >
        Settings
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        bg="bg-background"
      >
        <div className="flex flex-col gap-4 text-foreground md:w-2xl">
          <h2 className="flock-h2 text-primary">Settings</h2>
          <div className="border-t border-primary/20 pt-4">
            <ProfileForm profile={profile} />
          </div>
          <EmailForm currentEmail={email} />
          <PasswordForm />
          <DangerZone />
        </div>
      </Modal>
    </>
  );
}
