import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

async function check() {
  const connectionString = process.env.DATABASE_URL || "";
  console.log("Connecting to Neon DB via HTTP...");
  const adapter = new PrismaNeonHttp(connectionString, {} as any);
  const prisma = new PrismaClient({ adapter });

  try {
    const userCount = await prisma.user.count();
    const bizCount = await prisma.businessProfile.count();
    const ngoCount = await prisma.ngoProfile.count();
    const listingCount = await prisma.listing.count();

    console.log("--- NEON DB ROW COUNTS ---");
    console.log("Users:", userCount);
    console.log("BusinessProfiles:", bizCount);
    console.log("NgoProfiles:", ngoCount);
    console.log("Listings:", listingCount);
  } catch (err) {
    console.error("DB Check error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
