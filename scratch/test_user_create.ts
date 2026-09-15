import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { PrismaClient, Role } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

async function test() {
  const connectionString = process.env.DATABASE_URL || "";
  console.log("Testing user insertion without transaction...");
  const adapter = new PrismaNeonHttp(connectionString, {} as any);
  const prisma = new PrismaClient({ adapter });

  try {
    const testClerkId = `test_user_${Date.now()}`;
    const testEmail = `test_${Date.now()}@example.com`;

    console.log("Inserting user:", testClerkId);
    const createdUser = await prisma.user.create({
      data: {
        clerkUserId: testClerkId,
        email: testEmail,
        fullName: "Test User",
        role: Role.NGO,
      },
    });

    console.log("Created user successfully!", createdUser);

    const createdNgo = await prisma.ngoProfile.create({
      data: {
        userId: createdUser.id,
        orgName: "Test NGO Hub",
        address: "123 Test St",
        latitude: 40.7138,
        longitude: -74.001,
        receivingCapacity: 100,
        verificationStatus: "APPROVED",
      },
    });

    console.log("Created NGO profile successfully!", createdNgo);

    // Clean up test user
    await prisma.ngoProfile.delete({ where: { id: createdNgo.id } });
    await prisma.user.delete({ where: { id: createdUser.id } });
    console.log("Cleaned up test record.");
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
