"use server";

import { prisma } from "@/server/db/prisma";
import { getCurrentUser } from "@/server/auth/guards";
import { revalidatePath } from "next/cache";
import { ListingOutcome } from "@prisma/client";

export interface CreateListingInput {
  foodType: string;
  quantity: number;
  unit: string;
  condition: string;
  collectionDeadline: string; // ISO string or datetime
  outcome: ListingOutcome;
  originalPrice?: number;
  discountPrice?: number;
  latitude?: number;
  longitude?: number;
}

export async function createListingAction(input: CreateListingInput) {
  const user = await getCurrentUser();

  if (!user || !user.businessProfile) {
    throw new Error(
      "UNAUTHORIZED: Active business profile required. Please complete business onboarding at /business/onboarding first."
    );
  }

  return await createListingWithProfile(user.businessProfile.id, input);
}

async function createListingWithProfile(
  businessProfileId: string,
  input: CreateListingInput
) {
  const profile = await prisma.businessProfile.findUnique({
    where: { id: businessProfileId },
  });

  if (!profile) {
    throw new Error("Business profile not found");
  }

  const now = new Date();
  const deadline = new Date(input.collectionDeadline);

  const listing = await prisma.listing.create({
    data: {
      businessProfileId: profile.id,
      foodType: input.foodType,
      quantity: Number(input.quantity),
      unit: input.unit || "batches",
      condition: input.condition || "Safe & fresh",
      availableFrom: now,
      collectionDeadline: deadline,
      latitude: input.latitude ?? profile.latitude,
      longitude: input.longitude ?? profile.longitude,
      outcome: input.outcome,
      originalPrice: input.outcome === "DISCOUNT" ? input.originalPrice : null,
      discountPrice: input.outcome === "DISCOUNT" ? input.discountPrice : null,
      status: "OPEN",
    },
  });

  // Append initial status history
  await prisma.statusHistory.create({
    data: {
      listingId: listing.id,
      fromStatus: null,
      toStatus: "OPEN",
    },
  });

  revalidatePath("/business/console");
  revalidatePath("/ngo/console");
  return { success: true, listing };
}
