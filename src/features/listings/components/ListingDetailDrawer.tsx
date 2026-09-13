"use client";

import React, { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { StatusPill, ListingStatus } from "@/components/shared/StatusPill";
import { OutcomeBadge } from "@/components/shared/OutcomeBadge";
import { ListingOutcome } from "@prisma/client";
import {
  MapPin,
  Clock,
  Building2,
  Phone,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from "lucide-react";

export interface ListingDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    id: string;
    foodType: string;
    quantity: number;
    unit: string;
    condition: string;
    outcome: ListingOutcome;
    status: ListingStatus;
    originalPrice?: number | null;
    discountPrice?: number | null;
    collectionDeadline: string | Date;
    businessName?: string;
    address?: string;
    claimRequest?: {
      id: string;
      claimType: string;
      ngoName?: string;
      buyerName?: string;
      buyerContact?: string;
    } | null;
    pickup?: {
      windowStart: string | Date;
      windowEnd: string | Date;
      confirmedAt?: string | Date | null;
    } | null;
  } | null;
  onConfirmHandover?: (listingId: string) => Promise<void>;
  onCancelListing?: (listingId: string) => Promise<void>;
}

export const ListingDetailDrawer: React.FC<ListingDetailDrawerProps> = ({
  isOpen,
  onClose,
  listing,
  onConfirmHandover,
  onCancelListing,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!listing) return null;

  const handleConfirm = async () => {
    if (!onConfirmHandover) return;
    setIsProcessing(true);
    try {
      await onConfirmHandover(listing.id);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error confirming handover");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!onCancelListing) return;
    if (!confirm("Are you sure you want to cancel this surplus listing?")) return;
    setIsProcessing(true);
    try {
      await onCancelListing(listing.id);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error cancelling listing");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Surplus Batch Details" width="md">
      <div className="flex flex-col gap-6">
        {/* Header Badges */}
        <div className="flex items-center justify-between bg-[#F5F1E8] p-4 rounded-xl border border-[#E3DBC9]">
          <OutcomeBadge
            outcome={listing.outcome}
            originalPrice={listing.originalPrice}
            discountPrice={listing.discountPrice}
            unit={listing.unit}
          />
          <StatusPill status={listing.status} />
        </div>

        {/* Listing Title & Specs */}
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#211D19] mb-1">
            {listing.foodType}
          </h2>
          <p className="text-xs text-[#6B6157]">
            Batch ID: <code className="font-mono">{listing.id.slice(0, 8)}</code>
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-lg border border-[#E3DBC9]">
            <span className="text-[11px] text-[#6B6157] block">Quantity</span>
            <span className="text-sm font-semibold text-[#211D19]">
              {listing.quantity} {listing.unit}
            </span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-[#E3DBC9]">
            <span className="text-[11px] text-[#6B6157] block">Collection Deadline</span>
            <span className="text-xs font-semibold text-[#B8862B] flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              {new Date(listing.collectionDeadline).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Condition & Location */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2 text-xs text-[#211D19]">
            <Building2 className="w-4 h-4 text-[#6B6157] shrink-0 mt-0.5" />
            <div>
              <span className="font-medium block">
                {listing.businessName || "Artisan Crumbs Bakery"}
              </span>
              <span className="text-[#6B6157]">
                {listing.address || "124 Market Street, Downtown"}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#EFEAE0]/50 border border-[#E3DBC9] text-xs text-[#6B6157]">
            <strong className="text-[#211D19] font-medium block mb-0.5">
              Food Condition & Packaging:
            </strong>
            {listing.condition}
          </div>
        </div>

        {/* Claim / Handover Details */}
        {listing.claimRequest ? (
          <div className="p-4 rounded-xl border border-[#25423A]/30 bg-[#25423A]/5">
            <h3 className="font-semibold text-xs text-[#25423A] uppercase tracking-wider mb-2">
              Matched Claimant
            </h3>
            <div className="text-xs text-[#211D19]">
              <span className="font-semibold block text-sm">
                {listing.claimRequest.ngoName || listing.claimRequest.buyerName || "Matched Recipient"}
              </span>
              {listing.claimRequest.buyerContact && (
                <span className="text-[#6B6157] flex items-center gap-1 mt-1">
                  <Phone className="w-3.5 h-3.5" /> {listing.claimRequest.buyerContact}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-[#E3DBC9] bg-[#F5F1E8]/40 text-xs text-[#6B6157] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#B8862B]" />
            <span>No claim request submitted yet. Listing is open for discovery.</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col gap-2 pt-4 border-t border-[#E3DBC9] mt-auto">
          {listing.status === "OPEN" && onCancelListing && (
            <Button
              variant="danger"
              size="md"
              onClick={handleCancel}
              isLoading={isProcessing}
              className="w-full"
            >
              Cancel Surplus Listing
            </Button>
          )}

          {(listing.status === "MATCHED" || listing.status === "SCHEDULED" || listing.status === "REQUESTED") &&
            onConfirmHandover && (
              <Button
                variant="primary"
                size="lg"
                onClick={handleConfirm}
                isLoading={isProcessing}
                className="w-full"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm Pickup & Handover
              </Button>
            )}

          {listing.status === "CONFIRMED" && (
            <div className="p-3 rounded-lg bg-[#EBF5EE] text-[#1B4D2E] text-xs text-center font-medium border border-[#C5E6D0]">
              ✓ Pickup Handover Confirmed & Recorded in Impact History
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};
