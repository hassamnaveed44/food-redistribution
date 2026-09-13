"use server";

import { prisma } from "@/server/db/prisma";
import { getCurrentUser } from "@/server/auth/guards";
import { revalidatePath } from "next/cache";

export async function verifyOrganizationAction(
  id: string,
  type: "BUSINESS" | "NGO",
  status: "APPROVED" | "REJECTED"
) {
  const user = await getCurrentUser();

  if (type === "BUSINESS") {
    await prisma.businessProfile.update({
      where: { id },
      data: { verificationStatus: status },
    });
  } else {
    await prisma.ngoProfile.update({
      where: { id },
      data: { verificationStatus: status },
    });
  }

  revalidatePath("/admin/verifications");
  revalidatePath("/admin/organizations font-serif");
  revalidatePath("/admin/dashboard");

  return { success: true };
}
