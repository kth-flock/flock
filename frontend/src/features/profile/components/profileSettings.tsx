"use client";

import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { passwordSchema } from "@flock/shared/schemas/auth";
import { FaCamera, FaGear, FaTrash } from "react-icons/fa6";
import Button from "@/shared/components/button";
import Modal from "@/shared/components/modal";
import Input from "@/shared/components/formInputs";
import ImageUpload from "@/features/images/components/imageUpload";
import {
  uploadImageFetch,
  deleteImageFromS3Fetch,
} from "@/features/images/lib/api";
import {
  changeEmail,
  changePassword,
  deleteMyAccount,
  updateMyInfo,
} from "../lib/api";
import { useAuth } from "@/shared/auth/authContext";
import type { UserInfo } from "@flock/shared/schemas/user";
import { PrivateUser } from "@/shared/types/user";

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
      className={twMerge(
        "flock-ui-label",
        result.ok ? "text-success" : "text-error",
      )}
    >
      {result.message}
    </p>
  );
}

function SettingsSection({
  title,
  children,
  bordered = true,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  bordered?: boolean;
  className?: string;
}) {
  return (
    <section
      className={twMerge(
        "flex flex-col gap-2",
        bordered && "border-t border-primary/20 pt-4",
        className,
      )}
    >
      <h3 className="flock-h5 text-primary">{title}</h3>
      {children}
    </section>
  );
}

// Image and name both go through PATCH /me, so they're saved together and only
// the fields that changed are sent
function ProfileForm({ profile }: { profile: PrivateUser }) {
  const { refresh } = useAuth();
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const { save, isSaving, result } = useSave();

  const nameChanged =
    firstName.trim() !== profile.firstName ||
    lastName.trim() !== profile.lastName;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!image && !nameChanged) return;

    save(async () => {
      const changes: UserInfo = {};
      if (image) {
        changes.imageUrl = (await uploadImageFetch(image, "profiles")).imageUrl;
      }
      if (nameChanged) {
        changes.firstName = firstName.trim();
        changes.lastName = lastName.trim();
      }

      await updateMyInfo(changes);
      await refresh();

      if (image && profile.imageUrl) {
        deleteImageFromS3Fetch(profile.imageUrl).catch(() => {});
      }
      setImage(null);
      router.refresh();
    }, "Changes saved");
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 md:flex-row md:gap-16">
        <SettingsSection title="Profile image" bordered={false}>
          <ImageUpload
            className="size-28 rounded-full bg-accent/40 text-primary"
            onFileSelect={setImage}
            onFileRemove={() => setImage(null)}
          >
            {profile.imageUrl ? (
              <img
                src={profile.imageUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <FaCamera className="size-8" aria-hidden />
            )}
          </ImageUpload>
        </SettingsSection>
        <SettingsSection title="Name" bordered={false} className="flex-1">
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
        </SettingsSection>
      </div>
      <Button
        type="submit"
        variant="secondary"
        size="sm"
        className="self-start md:self-end"
        disabled={isSaving || (!image && !nameChanged)}
      >
        {isSaving ? "Saving..." : "Save changes"}
      </Button>
      <SaveResult result={result} />
    </form>
  );
}

function EmailForm({ currentEmail }: { currentEmail: string }) {
  const { refresh } = useAuth();
  const [email, setEmail] = useState(currentEmail);
  const [password, setPassword] = useState("");
  const { save, isSaving, result } = useSave();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    save(async () => {
      await changeEmail({ email, password });
      setPassword("");
      await refresh();
    }, "Email changed");
  }

  return (
    <SettingsSection title="Email">
      <form className={formRowStyle} onSubmit={handleSubmit}>
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          className={rowButtonStyle}
          disabled={isSaving || email === currentEmail}
        >
          {isSaving ? "Saving..." : "Update email"}
        </Button>
      </form>
      <SaveResult result={result} />
    </SettingsSection>
  );
}

function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { save, isSaving, result, setResult } = useSave();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setResult({ ok: false, message: "Passwords do not match" });
      return;
    }
    const passwordCheck = passwordSchema.safeParse(newPassword);
    if (!passwordCheck.success) {
      setResult({ ok: false, message: passwordCheck.error.issues[0].message });
      return;
    }

    save(async () => {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, "Password changed");
  }

  return (
    <SettingsSection title="Password">
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
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
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Update password"}
          </Button>
        </div>
      </form>
      <SaveResult result={result} />
    </SettingsSection>
  );
}

function DangerZone() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const { save, isSaving, result } = useSave();

  function handleDeleteAccount() {
    save(async () => {
      await deleteMyAccount();
      await logout();
      router.push("/");
      router.refresh();
    }, "Account deleted");
  }

  return (
    <section className="flex flex-col gap-3 rounded-2xl border-2 border-error/60 p-4">
      <h3 className="flock-h5 text-error">Danger zone</h3>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col">
          <p className="flock-ui-label">Delete account</p>
          <p className="flock-caption">
            {"Deletes your account and everything you've created."}
            <br />
            {"This action cannot be undone."}
          </p>
        </div>
        {isConfirmingDelete ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button
              variant="tertiary"
              size="sm"
              disabled={isSaving}
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              icon={<FaTrash />}
              iconPlacement="left"
              className="bg-error text-white hover:bg-error-dark"
              disabled={isSaving}
              onClick={handleDeleteAccount}
            >
              {isSaving ? "Deleting..." : "Yes, delete my account"}
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            icon={<FaTrash />}
            iconPlacement="left"
            className="shrink-0 border-error text-error hover:border-error-dark hover:bg-error/10 hover:text-error-dark"
            onClick={() => setIsConfirmingDelete(true)}
          >
            Delete account
          </Button>
        )}
      </div>
      <SaveResult result={result} />
    </section>
  );
}

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
