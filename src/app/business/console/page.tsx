import React from "react";
import { prisma } from "@/server/db/prisma";
import { getCurrentUser } from "@/server/auth/guards";
import { BusinessConsoleClient } from "./BusinessConsoleClient";

export const dynamic = "force-dynamic";

export default async function BusinessConsolePage() {
  const user = await getCurrentUser();

  let listings: any[] = [];
  try {
    listings = await prisma.listing.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        businessProfile: true,
        claimRequests: {
          include: {
            ngoProfile: true,
            buyerProfile: true,
          },
        },
        pickup: true,
      },
    });
  } catch (e) {
    console.warn("Build/Fetch fallback for listings:", e);
  }


  // Calculate stats
  const totalActive = listings.filter((l) => l.status === "OPEN" || l.status === "MATCHED" || l.status === "SCHEDULED").length;
  const donateCount = listings.filter((l) => l.outcome === "DONATE").length;
  const discountCount = listings.filter((l) => l.outcome === "DISCOUNT").length;
  const totalQuantity = listings.reduce((sum, l) => sum + l.quantity, 0);

  const formattedListings = listings.map((l) => ({
    id: l.id,
    foodType: l.foodType,
    quantity: l.quantity,
    unit: l.unit,
    condition: l.condition,
    outcome: l.outcome,
    status: l.status,
    originalPrice: l.originalPrice ? Number(l.originalPrice) : null,
    discountPrice: l.discountPrice ? Number(l.discountPrice) : null,
    collectionDeadline: l.collectionDeadline ? l.collectionDeadline.toISOString() : new Date().toISOString(),
    businessName: l.businessProfile?.businessName || "Artisan Crumbs Bakery",
    address: l.businessProfile?.address || "124 Market Street",
    claimRequest: l.claimRequests && l.claimRequests[0]
      ? {
          id: l.claimRequests[0].id,
          claimType: l.claimRequests[0].claimType,
          ngoName: l.claimRequests[0].ngoProfile?.orgName,
          buyerName: l.claimRequests[0].buyerProfile?.name,
          buyerContact: l.claimRequests[0].buyerProfile?.contact,
        }
      : null,
    pickup: l.pickup
      ? {
          windowStart: l.pickup.windowStart ? l.pickup.windowStart.toISOString() : new Date().toISOString(),
          windowEnd: l.pickup.windowEnd ? l.pickup.windowEnd.toISOString() : new Date().toISOString(),
          confirmedAt: l.pickup.confirmedAt ? l.pickup.confirmedAt.toISOString() : null,
        }
      : null,
  }));

  return (
    <BusinessConsoleClient
      initialListings={formattedListings}
      stats={{
        totalActive,
        donateCount,
        discountCount,
        totalQuantity,
      }}
      userName={user?.fullName || "Business Manager"}
    />
  );
}
