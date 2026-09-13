/**
 * Calculates Haversine distance in kilometers between two lat/lng points.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Rounded to 1 decimal place
}

/**
 * Derives latitude and longitude bounding box min/max for DB layer spatial filtering.
 * ~1 degree latitude ≈ 111 km.
 */
export function getBoundingBox(
  latitude: number,
  longitude: number,
  radiusKm: number = 25
) {
  const latDelta = radiusKm / 111;
  const lonDelta = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180));

  return {
    minLat: latitude - latDelta,
    maxLat: latitude + latDelta,
    minLon: longitude - lonDelta,
    maxLon: longitude + lonDelta,
  };
}

export interface CandidateListing {
  id: string;
  foodType: string;
  quantity: number;
  unit: string;
  condition: string;
  outcome: "DONATE" | "DISCOUNT";
  status: string;
  collectionDeadline: string | Date;
  latitude: number;
  longitude: number;
  businessName?: string;
  address?: string;
  originalPrice?: number | null;
  discountPrice?: number | null;
}

export function rankMatchedListings(
  candidates: CandidateListing[],
  ngoLat: number,
  ngoLon: number,
  ngoCapacity: number
) {
  return candidates
    .map((item) => {
      const distanceKm = calculateHaversineDistance(
        ngoLat,
        ngoLon,
        item.latitude,
        item.longitude
      );
      const isWithinCapacity = item.quantity <= ngoCapacity;
      const hoursUntilDeadline =
        (new Date(item.collectionDeadline).getTime() - Date.now()) /
        (1000 * 60 * 60);

      return {
        ...item,
        distanceKm,
        isWithinCapacity,
        hoursUntilDeadline,
      };
    })
    .sort((a, b) => {
      // Sort by urgency first (approaching deadline), then distance
      if (a.hoursUntilDeadline !== b.hoursUntilDeadline) {
        return a.hoursUntilDeadline - b.hoursUntilDeadline;
      }
      return a.distanceKm - b.distanceKm;
    });
}
