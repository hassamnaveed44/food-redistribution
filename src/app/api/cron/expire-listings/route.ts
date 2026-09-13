import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const now = new Date();

    // 1. Bulk flip past-deadline OPEN listings to EXPIRED
    const expiredResult = await prisma.listing.updateMany({
      where: {
        status: "OPEN",
        collectionDeadline: {
          lt: now,
        },
      },
      data: {
        status: "EXPIRED",
      },
    });

    // 2. Bulk flip past-deadline SCHEDULED pickups without confirmation to CANCELLED
    const cancelledResult = await prisma.listing.updateMany({
      where: {
        status: "SCHEDULED",
        collectionDeadline: {
          lt: now,
        },
      },
      data: {
        status: "CANCELLED",
      },
    });

    return NextResponse.json({
      success: true,
      expiredCount: expiredResult.count,
      cancelledCount: cancelledResult.count,
      executedAt: now.toISOString(),
    });
  } catch (error: any) {
    console.error("Cron expiry job error:", error);
    return NextResponse.json(
      { error: "CRON_EXECUTION_FAILED", message: error.message },
      { status: 500 }
    );
  }
}
