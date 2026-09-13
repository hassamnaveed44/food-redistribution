import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import {
  PrismaClient,
  Role,
  VerificationStatus,
  ListingOutcome,
  ListingStatus,
} from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

function getPrisma() {
  const connectionString = process.env.DATABASE_URL || "";
  const adapter = new PrismaNeonHttp(connectionString, {} as any);
  return new PrismaClient({ adapter });
}

async function main() {
  console.log("Seeding database...");
  const prisma = getPrisma();

  try {
    // Clean existing tables
    await prisma.statusHistory.deleteMany();
    await prisma.pickup.deleteMany();
    await prisma.claimRequest.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.verificationDocument.deleteMany();
    await prisma.buyerProfile.deleteMany();
    await prisma.ngoProfile.deleteMany();
    await prisma.businessProfile.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.report.deleteMany();
    await prisma.user.deleteMany();

    // Create Users
    const businessUser = await prisma.user.create({
      data: {
        clerkUserId: "user_business_demo_01",
        email: "baker@artisancrumbs.com",
        fullName: "Marco Rossi (Artisan Crumbs)",
        role: Role.BUSINESS,
      },
    });

    const ngoUser = await prisma.user.create({
      data: {
        clerkUserId: "user_ngo_demo_01",
        email: "coordinator@hopehaven.org",
        fullName: "Sarah Jenkins (Hope Haven Shelter)",
        role: Role.NGO,
      },
    });

    await prisma.user.create({
      data: {
        clerkUserId: "user_admin_demo_01",
        email: "admin@foodbridge.org",
        fullName: "System Administrator",
        role: Role.ADMIN,
      },
    });

    // Create Business Profile
    const businessProfile = await prisma.businessProfile.create({
      data: {
        userId: businessUser.id,
        businessName: "Artisan Crumbs Bakery & Cafe",
        address: "124 Market Street, Downtown",
        latitude: 40.7128,
        longitude: -74.006,
        verificationStatus: VerificationStatus.APPROVED,
      },
    });

    // Create NGO Profile
    await prisma.ngoProfile.create({
      data: {
        userId: ngoUser.id,
        orgName: "Hope Haven Community Shelter",
        address: "450 5th Avenue, Midtown",
        latitude: 40.7138,
        longitude: -74.001,
        receivingCapacity: 150,
        verificationStatus: VerificationStatus.APPROVED,
      },
    });

    // Create Sample Surplus Listings
    const now = new Date();
    const deadline1 = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const deadline2 = new Date(now.getTime() + 4 * 60 * 60 * 1000);

    const donateListing = await prisma.listing.create({
      data: {
        businessProfileId: businessProfile.id,
        foodType: "Assorted Sourdough & Pastries",
        quantity: 35,
        unit: "portions",
        condition: "Freshly baked today, safe packaging",
        availableFrom: now,
        collectionDeadline: deadline1,
        latitude: 40.7128,
        longitude: -74.006,
        outcome: ListingOutcome.DONATE,
        status: ListingStatus.OPEN,
      },
    });

    const discountListing = await prisma.listing.create({
      data: {
        businessProfileId: businessProfile.id,
        foodType: "Gourmet Sandwich & Salad Combo",
        quantity: 12,
        unit: "meals",
        condition: "Refrigerated, prepared 4 hours ago",
        availableFrom: now,
        collectionDeadline: deadline2,
        latitude: 40.7128,
        longitude: -74.006,
        outcome: ListingOutcome.DISCOUNT,
        originalPrice: 18.5,
        discountPrice: 6.0,
        status: ListingStatus.OPEN,
      },
    });

    // Status History
    await prisma.statusHistory.createMany({
      data: [
        {
          listingId: donateListing.id,
          fromStatus: null,
          toStatus: ListingStatus.OPEN,
        },
        {
          listingId: discountListing.id,
          fromStatus: null,
          toStatus: ListingStatus.OPEN,
        },
      ],
    });

    console.log("✅ Database seeded successfully with demo profiles & listings!");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("Seeding error:", e);
  process.exit(1);
});
