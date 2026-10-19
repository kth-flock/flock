import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicProfileClient from "@/features/profile/components/publicProfileClient";
import { idSchema } from "@flock/shared/schemas/common";

export const metadata: Metadata = { title: "Profile • Flock" };

export default async function ProfilePage({
  params,
}: PageProps<"/profile/[profileId]">) {
  const { profileId } = await params;
  const parsed = idSchema.safeParse(profileId);
  if (!parsed.success) notFound();

  return <PublicProfileClient profileId={parsed.data} />;
}
