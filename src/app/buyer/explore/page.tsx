import { getCurrentUser, requireRole } from "@/server/auth/guards";
import { Role } from "@prisma/client";
import { getMatchedListingsForBuyer } from "@/features/listings/queries/getListings";
import { BuyerExploreClient } from "./BuyerExploreClient";

export const dynamic = "force-dynamic";

export default async function BuyerExplorePage() {
  const user = await requireRole([Role.BUYER, Role.BUSINESS, Role.NGO, Role.ADMIN]);
  const listings = await getMatchedListingsForBuyer();

  return (
    <BuyerExploreClient
      initialListings={listings}
      userName={user?.fullName || "Food Rescuer"}
    />
  );
}
