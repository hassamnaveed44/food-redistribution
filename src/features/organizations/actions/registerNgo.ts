"use server";

import { prisma } from "@/server/db/prisma";
import { getCurrentUser } from "@/server/auth/guards";
import { revalidatePath } from "next/cache";

export async function registerNgoAction(formData: {
  orgName: string;
  address?: string;
  latitude: number;
  longitude: number;
  receivingCapacity: number;
  documentStorageKey?: string;
}) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  // Update user role if needed
  await prisma.user.update({
    where: { id: user.id },
    data: { role: "NGO" },
  });

  // Create NGO Profile
  const profile = await prisma.ngoProfile.upsert({
    where: { userId: user.id },
    update: {
      orgName: formData.orgName,
      address: formData.address || null,
      latitude: formData.latitude,
      longitude: formData.longitude,
      receivingCapacity: formData.receivingCapacity,
      verificationStatus: "PENDING",
    },
    create: {
      userId: user.id,
      orgName: formData.orgName,
      address: formData.address || null,
      latitude: formData.latitude,
      longitude: formData.longitude,
      receivingCapacity: formData.receivingCapacity,
      verificationStatus: "PENDING",
    },
  });

  if (formData.documentStorageKey) {
    await prisma.verificationDocument.create({
      data: {
        ngoProfileId: profile.id,
        storageKey: formData.documentStorageKey,
      },
    });
  }

  revalidatePath("/ngo/console");
  return { success: true, profile };
}
