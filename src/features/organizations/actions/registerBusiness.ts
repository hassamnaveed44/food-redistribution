"use server";

import { prisma } from "@/server/db/prisma";
import { getCurrentUser } from "@/server/auth/guards";
import { revalidatePath } from "next/cache";

export async function registerBusinessAction(formData: {
  businessName: string;
  address: string;
  latitude: number;
  longitude: number;
  documentStorageKey?: string;
}) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  // Update user role if needed
  await prisma.user.update({
    where: { id: user.id },
    data: { role: "BUSINESS" },
  });

  // Create Business Profile
  const profile = await prisma.businessProfile.upsert({
    where: { userId: user.id },
    update: {
      businessName: formData.businessName,
      address: formData.address,
      latitude: formData.latitude,
      longitude: formData.longitude,
      verificationStatus: "PENDING",
    },
    create: {
      userId: user.id,
      businessName: formData.businessName,
      address: formData.address,
      latitude: formData.latitude,
      longitude: formData.longitude,
      verificationStatus: "PENDING",
    },
  });

  if (formData.documentStorageKey) {
    await prisma.verificationDocument.create({
      data: {
        businessProfileId: profile.id,
        storageKey: formData.documentStorageKey,
      },
    });
  }

  revalidatePath("/business/console");
  return { success: true, profile };
}
