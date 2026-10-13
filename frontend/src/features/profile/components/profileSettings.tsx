"use client";

import { useRef, useState } from "react";
import { FaCamera, FaGear, FaTrash, FaX } from "react-icons/fa6";
import Button, { IconButton } from "@/shared/components/button";
import Input from "@/shared/components/formInputs";
import ImageUpload from "@/shared/components/imageUpload";
import type { ProfileDetails } from "../lib/types";

// TODO: none of the forms are connected to the backend yet.
// - Picture: upload with uploadImageFetch(file, "profiles"), then PATCH /me { imageUrl }
// - Name: PATCH /me { firstName, lastName }
// - Email and password: the backend has no endpoints for these yet
// - Delete account: DELETE /me, then send the user to the start page

const formRowStyle = "flex flex-col gap-2 md:flex-row md:items-start";
// Lines the small buttons up with the middle of the inputs beside them
const rowButtonStyle = "shrink-0 md:mt-3.5";

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2 border-t border-primary/20 pt-4">
      <h3 className="flock-h5 text-primary">{title}</h3>
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
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  function handlePictureSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function handleNameSubmit(e: React.FormEvent<HTMLFormElement>) {
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
        className="m-auto w-full max-w-2xl rounded-3xl bg-background p-6 text-foreground shadow-lg backdrop:bg-black/50 md:p-8"
        onClose={() => setIsConfirmingDelete(false)}
        // Clicks on the backdrop land on the dialog element itself
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="flex flex-col gap-4">
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
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                disabled={!picture}
              >
                Save picture
              </Button>
            </form>
          </SettingsSection>

          <SettingsSection title="Name">
            <form className={formRowStyle} onSubmit={handleNameSubmit}>
              <Input
                id="settings-first-name"
                aria-label="First name"
                placeholder="First name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                id="settings-last-name"
                aria-label="Last name"
                placeholder="Last name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                className={rowButtonStyle}
                disabled={
                  firstName === profile.firstName &&
                  lastName === profile.lastName
                }
              >
                Save name
              </Button>
            </form>
          </SettingsSection>

          <SettingsSection title="Email">
            <form className={formRowStyle} onSubmit={handleEmailSubmit}>
              <Input
                id="settings-email"
                type="email"
                aria-label="New email"
                placeholder="New email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                className={rowButtonStyle}
              >
                Update email
              </Button>
            </form>
          </SettingsSection>

          <SettingsSection title="Password">
            <form
              className="flex flex-col gap-2"
              onSubmit={handlePasswordSubmit}
            >
              <Input
                id="settings-current-password"
                type="password"
                aria-label="Current password"
                placeholder="Current password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <div className={formRowStyle}>
                <Input
                  id="settings-new-password"
                  type="password"
                  aria-label="New password"
                  placeholder="New password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  id="settings-confirm-password"
                  type="password"
                  aria-label="Confirm new password"
                  placeholder="Confirm new password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={passwordError}
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  className={rowButtonStyle}
                >
                  Update password
                </Button>
              </div>
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
                  size="sm"
                  icon={<FaTrash />}
                  iconPlacement="left"
                  className="bg-error text-white hover:bg-error-dark"
                  onClick={handleDeleteAccount}
                >
                  Yes, delete my account
                </Button>
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => setIsConfirmingDelete(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                size="sm"
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
