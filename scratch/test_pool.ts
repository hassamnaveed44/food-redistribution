import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

async function testPool() {
  const connectionString = process.env.DATABASE_URL || "";
  console.log("Connecting via Neon Pool...");
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool as any);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Testing user count over Neon Pool...");
    const count = await prisma.user.count();
    console.log("User count over Pool:", count);

    const testId = `pool_user_${Date.now()}`;
    const testUser = await prisma.user.create({
      data: {
        clerkUserId: testId,
        email: `${testId}@example.com`,
        fullName: "Pool Test User",
        role: "NGO",
      },
    });
    console.log("SUCCESSFULLY CREATED USER OVER POOL!", testUser);

    await prisma.user.delete({ where: { id: testUser.id } });
    console.log("Deleted test user cleanly.");
  } catch (err) {
    console.error("Pool test error:", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

testPool();
