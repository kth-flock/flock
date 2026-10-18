import type { PrivateUser } from "@/shared/types/user";
import { useAuth } from "@/shared/auth/authContext";
import { useState } from "react";
import type { UserInfo } from "@flock/shared/schemas/user";
import {
  uploadImageFetch,
  deleteImageFromS3Fetch,
} from "@/features/images/lib/api";
import { updateMyInfo } from "../lib/api";
import ImageUpload from "@/features/images/components/imageUpload";
import { FaCamera } from "react-icons/fa6";
import Input from "@/shared/components/formInputs";
import Button from "@/shared/components/button";
import { SaveResult } from "./profileSettings";
import { useSave } from "../hooks/useSave";
import SettingsSection from "./settingsSection";

// Image and name both go through PATCH /me, so they're saved together and only
// the fields that changed are sent
export default function ProfileForm({ profile }: { profile: PrivateUser }) {
  const { refresh } = useAuth();
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
