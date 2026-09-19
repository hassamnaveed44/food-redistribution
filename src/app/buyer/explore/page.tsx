import { getCurrentUser } from "@/server/auth/guards";
import { getMatchedListingsForBuyer } from "@/features/listings/queries/getListings";
import { BuyerExploreClient } from "./BuyerExploreClient";

export const dynamic = "force-dynamic";

export default async function BuyerExplorePage() {
  const user = await getCurrentUser();
  const listings = await getMatchedListingsForBuyer();

  return (
    <BuyerExploreClient
      initialListings={listings}
      userName={user?.fullName || "Food Rescuer"}
    />
  );
}
