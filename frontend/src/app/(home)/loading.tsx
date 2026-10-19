import { cookies } from "next/headers";
import DashboardSkeleton from "@/features/dashboard/components/dashboardSkeleton";
import Spinner from "@/shared/components/spinner";

export default async function HomeLoading() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return;
  return <DashboardSkeleton />;
}
