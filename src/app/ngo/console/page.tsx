import React from "react";
import { getCurrentUser } from "@/server/auth/guards";
import { getMatchedListingsForNgo } from "@/features/listings/queries/getListings";
import { NgoConsoleClient } from "./NgoConsoleClient";

export const dynamic = "force-dynamic";

export default async function NgoConsolePage() {
  const user = await getCurrentUser();

  const ngoProfile = user?.ngoProfile || {
    orgName: "Hope Haven Community Shelter",
    address: "450 5th Avenue, Midtown",
    latitude: 40.7138,
    longitude: -74.001,
    receivingCapacity: 150,
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
