"use server";

import { prisma } from "@/server/db/prisma";
import { getCurrentUser } from "@/server/auth/guards";
import { revalidatePath } from "next/cache";

export async function confirmPickupAction(listingId: string) {
  const user = await getCurrentUser();

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { pickup: true },
  });

  if (!listing) {
    throw new Error("Listing not found");
  }

  const previousStatus = listing.status;

  // Update listing status
  const updatedListing = await prisma.listing.update({
    where: { id: listingId },
    data: { status: "CONFIRMED" },
  });

  // Upsert pickup record
  if (listing.pickup) {
    await prisma.pickup.update({
      where: { listingId },
      data: {
        confirmedAt: new Date(),
        confirmedById: user?.id || null,
      },
    });
  } else {
    await prisma.pickup.create({
      data: {
        listingId,
        windowStart: new Date(),
        windowEnd: listing.collectionDeadline,
        confirmedAt: new Date(),
        confirmedById: user?.id || null,
      },
    });
  }

  // Record status history
  await prisma.statusHistory.create({
    data: {
      listingId,
      fromStatus: previousStatus,
      toStatus: "CONFIRMED",
    },
  });

  revalidatePath("/business/console");
  revalidatePath("/ngo/console");
  revalidatePath("/business/reporting");
  revalidatePath("/ngo/history");

  return { success: true, listing: updatedListing };
}
