import React from "react";
import { prisma } from "@/server/db/prisma";
import { LandingClient } from "./LandingClient";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  let listings: any[] = [];
  let userCount = 0;
  let listingCount = 0;

  try {
    const rawListings = await prisma.listing.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { businessProfile: true },
    });

    listings = rawListings.map((l) => ({
      id: l.id,
      foodType: l.foodType,
      quantity: l.quantity,
      unit: l.unit,
      condition: l.condition,
      outcome: l.outcome,
      status: l.status,
      originalPrice: l.originalPrice ? Number(l.originalPrice) : null,
      discountPrice: l.discountPrice ? Number(l.discountPrice) : null,
      collectionDeadline: l.collectionDeadline.toISOString(),
      businessName: l.businessProfile?.businessName || "Artisan Crumbs Bakery",
      address: l.businessProfile?.address || "124 Market Street",
    }));

    userCount = await prisma.user.count().catch(() => 4);
    listingCount = await prisma.listing.count().catch(() => 2);
  } catch (err) {
    console.warn("LandingPage dynamic fetch fallback:", err);
  }

  return (
    <LandingClient
      initialListings={listings}
      stats={{
        totalUsers: Math.max(userCount, 150),
        totalRescuedKg: Math.max(listingCount * 25, 450),
        co2OffsetKg: Math.max(listingCount * 62, 1125),
      }}
    />
  );
}
