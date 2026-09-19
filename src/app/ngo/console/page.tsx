import React from "react";
import { getCurrentUser, requireRole } from "@/server/auth/guards";
import { Role } from "@prisma/client";
import { getMatchedListingsForNgo } from "@/features/listings/queries/getListings";
import { NgoConsoleClient } from "./NgoConsoleClient";

export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

export default async function NgoConsolePage() {
  const user = await requireRole([Role.NGO, Role.ADMIN]);

  if (!user.ngoProfile && user.role !== "ADMIN") {
    redirect("/ngo/onboarding");
  }

  const ngoProfile = user.ngoProfile || {
    id: "admin-ngo",
    orgName: "Admin NGO Relief Hub",
    address: "Admin Headquarters",
    latitude: 40.7138,
    longitude: -74.001,
    receivingCapacity: 200,
  };

  let matchedListings: any[] = [];
  try {
    matchedListings = await getMatchedListingsForNgo(
      ngoProfile.latitude,
      ngoProfile.longitude,
      ngoProfile.receivingCapacity
    );
  } catch (e) {
    console.warn("NgoConsolePage build/fetch fallback:", e);
  }

  return (
    <NgoConsoleClient
      ngoProfile={ngoProfile}
      initialListings={matchedListings}
      userName={user?.fullName || "NGO Coordinator"}
    />
  );
}
