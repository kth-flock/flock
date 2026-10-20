"use client";

import { useMemo, useState } from "react";
import { byOldest } from "@/shared/lib/sort";
import type { ExtendedAnnouncement } from "@/shared/types/event";
import Comment from "./comment";
import ReplyForm from "./replyForm";
import EditablePost from "./editablePost";
import { deleteAnnouncement, updateAnnouncement } from "../lib/api";
import { getErrorMessage } from "@/shared/lib/errors";
import { updateAnnouncementSchema } from "@flock/shared/schemas/announcement";
import { useToast } from "@/shared/components/toast";

export default function Announcement({
  announcement,
  isHost = false,
  onChange,
}: {
  announcement: ExtendedAnnouncement;
  isHost?: boolean;
  onChange: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const comments = useMemo(
    () => [...announcement.comments].sort(byOldest),
    [announcement.comments],
  );

  async function handleRemove() {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteAnnouncement(announcement.eventId, announcement.id);
      onChange();
      toast("Update deleted!", "success");
    } catch (err) {
      setError(
        getErrorMessage(err, "Couldn't delete the update. Please try again."),
      );
      setIsDeleting(false);
    }
  }

  async function handleSave(content: string) {
    setError(null);
    const updateAnnouncementResult = updateAnnouncementSchema.safeParse({
      content,
    });
    try {
      if (updateAnnouncementResult.success) {
        await updateAnnouncement(
          announcement.eventId,
          announcement.id,
          updateAnnouncementResult.data,
        );
        onChange();
        toast("Update edited!", "success");
      } else {
        setError(updateAnnouncementResult.error.issues[0].message);
      }
    } catch (err) {
      setError(
        getErrorMessage(err, "Couldn't edit the update. Please try again."),
      );
    }
  }

  return (
    <li className="flex flex-col gap-3 rounded-2xl border-2 border-neutral p-4 md:p-6">
      <EditablePost
        author={announcement.user}
        createdAt={announcement.createdAt}
        content={announcement.content}
        label="update"
        onSave={handleSave}
        onRemove={handleRemove}
        onEditingChange={setIsEditing}
        isDeleting={isDeleting}
      />

      {error && (
        <p className="flock-caption text-error!" role="alert">
          {error}
        </p>
      )}

      {comments.length > 0 && (
        <ul className="flex flex-col gap-3 border-l-2 border-accent/50 pl-4">
          {comments.map((comment) => (
            <li key={comment.id}>
              <Comment
                comment={comment}
                eventId={announcement.eventId}
                isHost={isHost}
                disableEdit={isEditing}
                onChange={onChange}
              />
            </li>
          ))}
        </ul>
      )}

      {!isEditing && (
        <ReplyForm
          announcementId={announcement.id}
          eventId={announcement.eventId}
          onChange={onChange}
        />
      )}
    </li>
  );
}
