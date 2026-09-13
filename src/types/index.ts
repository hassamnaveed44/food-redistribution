export type Role = "BUSINESS" | "NGO" | "ADMIN" | "BUYER";
export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ListingOutcome = "DONATE" | "DISCOUNT";
export type ListingStatus =
  | "OPEN"
  | "REQUESTED"
  | "MATCHED"
  | "SCHEDULED"
  | "CONFIRMED"
  | "EXPIRED"
  | "CANCELLED";

export type ClaimType = "DONATION" | "PURCHASE";
export type ClaimStatus = "REQUESTED" | "ACCEPTED" | "DECLINED";

export interface BusinessProfileType {
  id: string;
  userId: string;
  businessName: string;
  address: string;
  latitude: number;
  longitude: number;
  verificationStatus: VerificationStatus;
}

export interface NgoProfileType {
  id: string;
  userId: string;
  orgName: string;
  address?: string | null;
  latitude: number;
  longitude: number;
  receivingCapacity: number;
  verificationStatus: VerificationStatus;
}

export interface ListingType {
  id: string;
  businessProfileId: string;
  businessName?: string;
  foodType: string;
  quantity: number;
  unit: string;
  condition: string;
  availableFrom: string | Date;
  collectionDeadline: string | Date;
  latitude: number;
  longitude: number;
  outcome: ListingOutcome;
  originalPrice?: number | null;
  discountPrice?: number | null;
  status: ListingStatus;
  distanceKm?: number;
  createdAt: string | Date;
}
