"use server";

import { prisma } from "@/server/db/prisma";
import { getCurrentUser } from "@/server/auth/guards";
import { revalidatePath } from "next/cache";
import { ClaimType } from "@prisma/client";

export interface RequestClaimInput {
  listingId: string;
  claimType: ClaimType;
  buyerName?: string;
  buyerContact?: string;
}

export async function requestClaimAction(input: RequestClaimInput) {
  const user = await getCurrentUser();

  // Explicit Prisma Transaction with Optimistic WHERE status = 'OPEN' Guard
  const result = await prisma.$transaction(async (tx) => {
    // Optimistic concurrency check
    const updated = await tx.listing.updateMany({
      where: {
        id: input.listingId,
        status: "OPEN",
      },
      data: {
        status: "REQUESTED",
      },
    });

    if (updated.count === 0) {
      throw new Error("409 LISTING_ALREADY_CLAIMED: Listing was already claimed or is no longer open.");
    }

    // Get NGO profile if available
    const ngoProfileId = user?.ngoProfile?.id || null;

    // Create BuyerProfile for discount purchase path if needed
    let buyerProfileId: string | null = null;
    if (input.claimType === "PURCHASE") {
      const buyerProfile = await tx.buyerProfile.create({
        data: {
          userId: user?.id || null,
          name: input.buyerName || user?.fullName || "Guest Buyer",
          contact: input.buyerContact || user?.email || "buyer@example.com",
        },
      });
      buyerProfileId = buyerProfile.id;
    }

    // Create Claim Request
    const claimRequest = await tx.claimRequest.create({
      data: {
        listingId: input.listingId,
        claimType: input.claimType,
        ngoProfileId: input.claimType === "DONATION" ? ngoProfileId : null,
        buyerProfileId: input.claimType === "PURCHASE" ? buyerProfileId : null,
        status: "REQUESTED",
      },
    });

    // Record Status History
    await tx.statusHistory.create({
      data: {
        listingId: input.listingId,
        fromStatus: "OPEN",
        toStatus: "REQUESTED",
      },
    });

    return claimRequest;
  });

  revalidatePath("/business/console");
  revalidatePath("/ngo/console");

  return { success: true, claimRequest: result };
}
