export type NotificationType =
  | "INVITATION"
  | "ANNOUNCEMENT"
  | "ANNOUNCEMENT_COMMENT"
  | "FRIEND_REQUEST"
  | "FRIEND_REQUEST_ACCEPTED";

export type Notification = {
  id: string;
  type: NotificationType;
  createdAt: Date;
  from: {
    id: number;
    firstName: string;
    lastName: string;
    imageUrl: string | null;
  };
  event?: { id: number; title: string };
  announcement?: { id: number; content: string };
};
