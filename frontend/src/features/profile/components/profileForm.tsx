import type { PrivateUser } from "@/shared/types/user";
import { useAuth } from "@/shared/auth/authContext";
import { useState } from "react";
import type { UserInfo } from "@flock/shared/schemas/user";
import { uploadImageFetch } from "@/features/images/lib/api";
import { updateMyInfo } from "../lib/api";
import Input from "@/shared/components/formInputs";
import Button from "@/shared/components/button";
import { useSave } from "../hooks/useSave";
import SettingsSection from "./settingsSection";
import EditableImage from "@/shared/components/editableImage";
import { twMerge } from "tailwind-merge";

// Image and name both go through PATCH /me, so they're saved together and only
// the fields that changed are sent
export default function ProfileForm({ profile }: { profile: PrivateUser }) {
  const { refresh } = useAuth();

  const [image, setImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const { save, isSaving, errorMessage } = useSave();

  const nameChanged =
    firstName.trim() !== profile.firstName ||
    lastName.trim() !== profile.lastName;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!image && !removeImage && !nameChanged) return;

    save(
      async () => {
        const changes: UserInfo = {};
        if (image) {
          changes.imageUrl = (
            await uploadImageFetch(image, "profiles")
          ).imageUrl;
        } else if (removeImage) {
          changes.imageUrl = null;
        }
        if (nameChanged) {
          changes.firstName = firstName.trim();
          changes.lastName = lastName.trim();
        }

        await updateMyInfo(changes);
        await refresh();

        setImage(null);
        setRemoveImage(false);
        refresh();
      },
      "Changes saved",
      "Failed to save changes",
    );
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 md:flex-row md:gap-16">
        <SettingsSection
          title="Profile image"
          bordered={false}
          className="flex items-center"
        >
          <EditableImage
            key={profile.imageUrl ?? "none"}
            className="size-28 rounded-full bg-accent/40"
            iconSize={24}
            current={
              profile.imageUrl && (
                <img
                  src={profile.imageUrl}
                  alt=""
                  className="size-full object-cover"
                />
              )
            }
            onFileSelect={setImage}
            onFileRemove={() => setImage(null)}
            onDelete={profile.imageUrl ? () => setRemoveImage(true) : undefined}
            onCancel={() => setRemoveImage(false)}
          />
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
        isLoading={isSaving}
        disabled={isSaving || (!image && !removeImage && !nameChanged)}
      >
        {isSaving ? "Saving..." : "Save changes"}
      </Button>
      <p role={"alert"} className={twMerge("flock-ui-label", "text-error")}>
        {errorMessage}
      </p>
    </form>
  );
}
