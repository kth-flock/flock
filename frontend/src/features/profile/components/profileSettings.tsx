"use client";

import { useRef, useState } from "react";
import { FaCamera, FaGear, FaTrash, FaX } from "react-icons/fa6";
import Button, { IconButton } from "@/shared/components/button";
import Input from "@/shared/components/formInputs";
import ImageUpload from "@/shared/components/imageUpload";
import type { ProfileDetails } from "../lib/types";

// TODO: none of the forms are connected to the backend yet.
// - Picture: upload with uploadImageFetch(file, "profiles"), then PATCH /me { imageUrl }
// - Email and password: the backend has no endpoints for these yet
// - Delete account: DELETE /me, then send the user to the start page

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 border-t border-primary/20 pt-6">
      <h3 className="flock-h4 text-primary">{title}</h3>
      {children}
    </section>
  );
}

export default function ProfileSettings({
  profile,
}: {
  profile: ProfileDetails;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [picture, setPicture] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  function handlePictureSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordError(
      newPassword === confirmPassword ? "" : "Passwords do not match",
    );
  }

  function handleDeleteAccount() {}

  return (
    <>
      <Button
        icon={<FaGear />}
        iconPlacement="left"
        className="bg-white/15 text-white hover:bg-white/25"
        onClick={() => dialogRef.current?.showModal()}
      >
        Settings
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby="settings-title"
        className="m-auto w-full max-w-lg rounded-3xl bg-background p-6 text-foreground shadow-lg backdrop:bg-black/50 md:p-8"
        onClose={() => setIsConfirmingDelete(false)}
        // Clicks on the backdrop land on the dialog element itself
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <h2 id="settings-title" className="flock-h2 text-primary">
              Settings
            </h2>
            <IconButton
              variant="tertiary"
              size="sm"
              aria-label="Close settings"
              onClick={() => dialogRef.current?.close()}
            >
              <FaX />
            </IconButton>
          </div>

          <SettingsSection title="Profile picture">
            <form
              className="flex items-center gap-4"
              onSubmit={handlePictureSubmit}
            >
              <ImageUpload
                className="size-20 rounded-full bg-accent/40 text-primary"
                onFileSelect={setPicture}
                onFileRemove={() => setPicture(null)}
              >
                {profile.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.imageUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <FaCamera className="size-6" aria-hidden />
                )}
              </ImageUpload>
              <Button type="submit" variant="secondary" disabled={!picture}>
                Save picture
              </Button>
            </form>
          </SettingsSection>

          <SettingsSection title="Email">
            <form className="flex flex-col gap-3" onSubmit={handleEmailSubmit}>
              <Input
                id="settings-email"
                type="email"
                label="New email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" variant="secondary">
                Update email
              </Button>
            </form>
          </SettingsSection>

          <SettingsSection title="Password">
            <form
              className="flex flex-col gap-3"
              onSubmit={handlePasswordSubmit}
            >
              <Input
                id="settings-current-password"
                type="password"
                label="Current password"
                placeholder="Current password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Input
                id="settings-new-password"
                type="password"
                label="New password"
                placeholder="New password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                id="settings-confirm-password"
                type="password"
                label="Confirm new password"
                placeholder="Confirm new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={passwordError}
              />
              <Button type="submit" variant="secondary">
                Update password
              </Button>
            </form>
          </SettingsSection>

          <SettingsSection title="Delete account">
            <p className="flock-body-sm text-foreground/80">
              This removes your account and everything you&apos;ve created. It
              can&apos;t be undone.
            </p>
            {isConfirmingDelete ? (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  icon={<FaTrash />}
                  iconPlacement="left"
                  className="bg-error text-white hover:bg-error-dark"
                  onClick={handleDeleteAccount}
                >
                  Yes, delete my account
                </Button>
                <Button
                  variant="tertiary"
                  onClick={() => setIsConfirmingDelete(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                icon={<FaTrash />}
                iconPlacement="left"
                className="border-error text-error hover:border-error-dark hover:bg-error/10 hover:text-error-dark"
                onClick={() => setIsConfirmingDelete(true)}
              >
                Delete account
              </Button>
            )}
          </SettingsSection>
        </div>
      </dialog>
    </>
  );
}
