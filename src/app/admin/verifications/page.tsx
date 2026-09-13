import React from "react";
import { prisma } from "@/server/db/prisma";
import { VerificationsClient } from "./VerificationsClient";

export const dynamic = "force-dynamic";

export default async function AdminVerificationsPage() {
  let pendingBusinesses: any[] = [];
  let pendingNgos: any[] = [];

  try {
    pendingBusinesses = await prisma.businessProfile.findMany({
      where: { verificationStatus: "PENDING" },
      include: { verificationDocuments: true, user: true },
      orderBy: { createdAt: "desc" },
    });

    pendingNgos = await prisma.ngoProfile.findMany({
      where: { verificationStatus: "PENDING" },
      include: { verificationDocuments: true, user: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.warn("AdminVerifications fallback:", e);
  }

  return (
    <VerificationsClient
      initialBusinesses={pendingBusinesses}
      initialNgos={pendingNgos}
    />
  );
}
