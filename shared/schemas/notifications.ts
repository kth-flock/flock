import type { RsvpStatus } from "./event";
import type { PublicUser } from "@/shared/types/user";

export type NotificationType =
  | "INVITATION"
  | "ANNOUNCEMENT"
  | "ANNOUNCEMENT_COMMENT"
  | "FRIEND_REQUEST"
  | "FRIEND_REQUEST_ACCEPTED"
  | "RSVP";

export type Notification = {
  id: string;
  type: NotificationType;
  createdAt: Date;
  from: PublicUser;
  event?: { id: number; title: string };
  announcement?: { id: number; content: string };
  rsvp?: { status: RsvpStatus; comment?: string | null };
};
