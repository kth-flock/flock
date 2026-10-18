import { useAuth } from "@/shared/auth/authContext";
import { useState } from "react";
import { useSave } from "../hooks/useSave";
import { changeEmail } from "../lib/api";
import SettingsSection from "./settingsSection";
import Input from "@/shared/components/formInputs";
import Button from "@/shared/components/button";
import { SaveResult } from "./profileSettings";

export default function EmailForm({ currentEmail }: { currentEmail: string }) {
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
      <form
        className="flex flex-col gap-2 md:flex-row md:items-start"
        onSubmit={handleSubmit}
      >
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
          className="shrink-0 md:mt-3.5"
          disabled={isSaving || email === currentEmail}
        >
          {isSaving ? "Saving..." : "Update email"}
        </Button>
      </form>
      <SaveResult result={result} />
    </SettingsSection>
  );
}
