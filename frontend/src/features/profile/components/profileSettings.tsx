"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { passwordSchema } from "@flock/shared/schemas/auth";
import { FaCamera, FaGear, FaTrash } from "react-icons/fa6";
import Button from "@/shared/components/button";
import Modal from "@/shared/components/modal";
import Input from "@/shared/components/formInputs";
import ImageUpload from "@/shared/components/imageUpload";
import { changeEmailFetch, changePasswordFetch, deleteImageFromS3Fetch, updateMyInfoFetch, uploadImageFetch } from "@/shared/lib/api";
import type { ProfileDetails } from "../lib/types";

// TODO: delete account: DELETE /me, then log out and send the user to the start page

const formRowStyle = "flex flex-col gap-2 md:flex-row md:items-start";
const rowButtonStyle = "shrink-0 md:mt-3.5";

type Result = { ok: boolean; message: string };

function useSave() {
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function save(action: () => Promise<void>, successMessage: string) {
    setIsSaving(true);
    setResult(null);
    try {
      await action();
      setResult({ ok: true, message: successMessage });
    } catch (err) {
      setResult({
        ok: false,
        message:
          err instanceof TypeError
            ? "Couldn't reach the server. Try again."
            : err instanceof Error
              ? err.message
              : "Something went wrong",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return { save, isSaving, result, setResult };
}

function SaveResult({ result }: { result: Result | null }) {
  if (!result) return null;
  return (
    <p
      role={result.ok ? "status" : "alert"}
      className={`flock-ui-label ${result.ok ? "text-success" : "text-error"}`}
    >
      {result.message}
    </p>
  );
}

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
  email: currentEmail,
}: {
  profile: ProfileDetails;
  email: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const [picture, setPicture] = useState<File | null>(null);
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(currentEmail);
  const [emailPassword, setEmailPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const pictureSave = useSave();
  const nameSave = useSave();
  const emailSave = useSave();
  const passwordSave = useSave();

  function handlePictureSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!picture) return;

    void pictureSave.save(async () => {
      const { imageUrl } = await uploadImageFetch(picture, "profiles");
      await updateMyInfoFetch({ imageUrl });
      if (profile.imageUrl) {
        deleteImageFromS3Fetch(profile.imageUrl).catch(() => {});
      }
      router.refresh();
    }, "Picture saved");
  }

  function handleNameSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    void nameSave.save(async () => {
      await updateMyInfoFetch({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      router.refresh();
    }, "Name saved");
  }

  function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    void emailSave.save(async () => {
      await changeEmailFetch({ email, password: emailPassword });
      setEmailPassword("");
    }, "Email changed");
  }

  function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Checked here too, since the backend only answers with a general message
    if (newPassword !== confirmPassword) {
      passwordSave.setResult({ ok: false, message: "Passwords do not match" });
      return;
    }
    const passwordCheck = passwordSchema.safeParse(newPassword);
    if (!passwordCheck.success) {
      passwordSave.setResult({
        ok: false,
        message: passwordCheck.error.issues[0].message,
      });
      return;
    }

    void passwordSave.save(async () => {
      await changePasswordFetch({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, "Password changed");
  }

  function handleDeleteAccount() {}

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
        onClose={() => {
          setIsOpen(false);
          setIsConfirmingDelete(false);
        }}
        bg="bg-background"
      >
        <div className="flex flex-col gap-4 text-foreground md:w-2xl">
          <h2 className="flock-h2 text-primary">Settings</h2>

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
                disabled={!picture || pictureSave.isSaving}
              >
                {pictureSave.isSaving ? "Saving..." : "Save picture"}
              </Button>
            </form>
            <SaveResult result={pictureSave.result} />
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
                  nameSave.isSaving ||
                  (firstName === profile.firstName &&
                    lastName === profile.lastName)
                }
              >
                {nameSave.isSaving ? "Saving..." : "Save name"}
              </Button>
            </form>
            <SaveResult result={nameSave.result} />
          </SettingsSection>

          <SettingsSection title="Email">
            <form className={formRowStyle} onSubmit={handleEmailSubmit}>
              <Input
                id="settings-email"
                type="email"
                aria-label="Email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                id="settings-email-password"
                type="password"
                aria-label="Current password"
                placeholder="Current password"
                required
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                className={rowButtonStyle}
                disabled={emailSave.isSaving || email === currentEmail}
              >
                {emailSave.isSaving ? "Saving..." : "Update email"}
              </Button>
            </form>
            <SaveResult result={emailSave.result} />
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
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  className={rowButtonStyle}
                  disabled={passwordSave.isSaving}
                >
                  {passwordSave.isSaving ? "Saving..." : "Update password"}
                </Button>
              </div>
            </form>
            <SaveResult result={passwordSave.result} />
          </SettingsSection>

          <SettingsSection title="Delete account">
            <p className="flock-body-sm text-foreground/80">
              {"This removes your account and everything you've created. It can't be undone."}
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
      </Modal>
    </>
  );
}
