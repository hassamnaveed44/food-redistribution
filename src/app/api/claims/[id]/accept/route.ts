import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getCurrentUser } from "@/server/auth/guards";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id: listingId } = await params;
    const body = await req.json().catch(() => ({}));

    // Guard against double-allocation race condition
    const updated = await prisma.listing.updateMany({
      where: {
        id: listingId,
        status: "OPEN",
      },
      data: {
        status: "MATCHED",
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        {
          error: "409_LISTING_ALREADY_CLAIMED",
          message: "The listing was already claimed by another requester.",
        },
        { status: 409 }
      );
    }

    // Update claim request status to ACCEPTED
    await prisma.claimRequest.updateMany({
      where: { listingId },
      data: { status: "ACCEPTED" },
    });

    // Record status history
    await prisma.statusHistory.create({
      data: {
        listingId,
        fromStatus: "OPEN",
        toStatus: "MATCHED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Claim accepted successfully.",
    });
  } catch (error: any) {
    console.error("Error accepting claim:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: error.message },
      { status: 500 }
    );
  }
}
