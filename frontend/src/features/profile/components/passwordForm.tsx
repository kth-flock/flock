import { useState } from "react";
import { useSave } from "../hooks/useSave";
import { passwordSchema } from "@flock/shared/schemas/auth";
import { changePassword } from "../lib/api";
import SettingsSection from "./settingsSection";
import Input from "@/shared/components/formInputs";
import Button from "@/shared/components/button";
import { SaveResult } from "./profileSettings";

export default function PasswordForm() {
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
        <div className="flex flex-col gap-2 md:flex-row md:items-start">
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
            className="shrink-0 md:mt-3.5"
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
