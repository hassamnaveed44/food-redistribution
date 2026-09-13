import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/guards";

export const dynamic = "force-dynamic";

export default async function RoleRedirectPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.role === "BUSINESS") {
    if (!user.businessProfile) {
      redirect("/business/onboarding");
    }
    redirect("/business/console");
  }

  if (user.role === "NGO") {
    if (!user.ngoProfile) {
      redirect("/ngo/onboarding");
    }
    redirect("/ngo/console");
  }

  if (user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  redirect("/ngo/console");
}
