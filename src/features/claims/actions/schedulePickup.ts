"use server";

import { prisma } from "@/server/db/prisma";
import { getCurrentUser } from "@/server/auth/guards";
import { revalidatePath } from "next/cache";

export async function schedulePickupAction(
  listingId: string,
  windowStart: string,
  windowEnd: string
) {
  const user = await getCurrentUser();

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    throw new Error("Listing not found");
  }

  const previousStatus = listing.status;

  // Create or update Pickup window
  const pickup = await prisma.pickup.upsert({
    where: { listingId },
    update: {
      windowStart: new Date(windowStart),
      windowEnd: new Date(windowEnd),
    },
    create: {
      listingId,
      windowStart: new Date(windowStart),
      windowEnd: new Date(windowEnd),
    },
  });

  // Update listing status to SCHEDULED
  await prisma.listing.update({
    where: { id: listingId },
    data: { status: "SCHEDULED" },
  });

  // Record status history
  await prisma.statusHistory.create({
    data: {
      listingId,
      fromStatus: previousStatus,
      toStatus: "SCHEDULED",
    },
  });

  revalidatePath("/business/console");
  revalidatePath("/ngo/console");

  return { success: true, pickup };
}
