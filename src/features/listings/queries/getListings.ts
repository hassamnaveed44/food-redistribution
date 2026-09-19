import { prisma } from "@/server/db/prisma";
import { getBoundingBox, rankMatchedListings } from "@/features/matching/engine";

export async function getMatchedListingsForNgo(
  ngoLat: number = 40.7138,
  ngoLon: number = -74.001,
  ngoCapacity: number = 150,
  radiusKm: number = 25
) {
  const bbox = getBoundingBox(ngoLat, ngoLon, radiusKm);

  // SQL bounding box filter at database layer
  const rawListings = await prisma.listing.findMany({
    where: {
      status: {
        in: ["OPEN", "REQUESTED", "MATCHED", "SCHEDULED"],
      },
      latitude: {
        gte: bbox.minLat,
        lte: bbox.maxLat,
      },
      longitude: {
        gte: bbox.minLon,
        lte: bbox.maxLon,
      },
    },
    include: {
      businessProfile: true,
      claimRequests: {
        include: {
          ngoProfile: true,
          buyerProfile: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const candidates = rawListings.map((l) => ({
    id: l.id,
    foodType: l.foodType,
    quantity: l.quantity,
    unit: l.unit,
    condition: l.condition,
    outcome: l.outcome,
    status: l.status,
    collectionDeadline: l.collectionDeadline,
    latitude: l.latitude,
    longitude: l.longitude,
    businessName: l.businessProfile?.businessName || "Partner Bakery",
    address: l.businessProfile?.address || "Nearby Location",
    originalPrice: l.originalPrice ? Number(l.originalPrice) : null,
    discountPrice: l.discountPrice ? Number(l.discountPrice) : null,
    claimRequest: l.claimRequests[0] || null,
  }));

  // Rank in memory using Haversine & capacity
  return rankMatchedListings(candidates as any, ngoLat, ngoLon, ngoCapacity);
}

export async function getMatchedListingsForBuyer() {
  const rawListings = await prisma.listing.findMany({
    where: {
      status: {
        in: ["OPEN", "REQUESTED", "MATCHED", "SCHEDULED"],
      },
    },
    include: {
      businessProfile: true,
      claimRequests: {
        include: {
          ngoProfile: true,
          buyerProfile: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return rawListings.map((l) => ({
    id: l.id,
    foodType: l.foodType,
    quantity: l.quantity,
    unit: l.unit,
    condition: l.condition,
    outcome: l.outcome,
    status: l.status,
    collectionDeadline: l.collectionDeadline,
    latitude: l.latitude,
    longitude: l.longitude,
    businessName: l.businessProfile?.businessName || "Partner Bakery",
    address: l.businessProfile?.address || "Nearby Location",
    originalPrice: l.originalPrice ? Number(l.originalPrice) : null,
    discountPrice: l.discountPrice ? Number(l.discountPrice) : null,
    claimRequest: l.claimRequests[0] || null,
  }));
}
