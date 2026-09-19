import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/guards";

export const dynamic = "force-dynamic";

export default async function RoleRedirectPage({
  searchParams,
}: {
  searchParams?: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Explicit query parameter override (e.g., /redirect?role=business)
  if (params?.role === "business") redirect("/business/console");
  if (params?.role === "ngo") redirect("/ngo/console");
  if (params?.role === "buyer") redirect("/buyer/explore");

  // Route based on user's assigned role in database
  if (user.role === "BUSINESS") {
    redirect("/business/console");
  }

  if (user.role === "NGO") {
    redirect("/ngo/console");
  }

  if (user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  // Default for BUYER role & individual food rescuers
  redirect("/buyer/explore");
}
