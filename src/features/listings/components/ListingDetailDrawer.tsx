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
  AlertCircle,
  QrCode,
  Sparkles,
  ShieldCheck,
  PackageCheck,
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

  const pickupCode = `RESCUE-${listing.id.slice(0, 6).toUpperCase()}`;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Surplus Food & Magic Bag Pass" width="md">
      <div className="flex flex-col gap-6">
        {/* Header Badges */}
        <div className="flex items-center justify-between bg-[#FAF9F6] p-4 rounded-2xl border border-slate-200 shadow-sm">
          <OutcomeBadge
            outcome={listing.outcome}
            originalPrice={listing.originalPrice}
            discountPrice={listing.discountPrice}
            unit={listing.unit}
          />
          <StatusPill status={listing.status} quantityLeft={listing.quantity} />
        </div>

        {/* Digital Pickup Voucher Pass */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#004F38] to-[#002D2B] text-white shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-[#00CC88] block mb-1">
                DIGITAL PICKUP VOUCHER
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight text-white">
                {listing.foodType}
              </h3>
            </div>
            <QrCode className="w-10 h-10 text-[#00CC88] shrink-0" />
          </div>

          <div className="my-4 py-3 px-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between">
            <span className="text-xs text-emerald-100/80 font-medium">Pickup Token Code:</span>
            <code className="text-base font-mono font-black text-[#FFC72C] tracking-wider">
              {pickupCode}
            </code>
          </div>

          <div className="flex items-center justify-between text-xs text-emerald-100/90 pt-2 border-t border-white/10">
            <span className="flex items-center gap-1 font-bold text-[#FF5A5F]">
              <Clock className="w-3.5 h-3.5" />
              Deadline: {new Date(listing.collectionDeadline).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="font-extrabold text-white">
              {listing.quantity} {listing.unit}
            </span>
          </div>
        </div>

        {/* Store & Location Details */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-3">
          <div className="flex items-start gap-2.5 text-xs text-[#0F172A]">
            <Building2 className="w-4 h-4 text-[#FF5A5F] shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-sm block text-[#004F38]">
                {listing.businessName || "Artisan Crumbs Bakery"}
              </span>
              <span className="text-slate-600 font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#00CC88]" />
                {listing.address || "124 Market Street, Downtown"}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-slate-200 text-xs text-slate-600">
            <strong className="text-[#004F38] font-bold block mb-1">
              Food Condition & Packaging Notes:
            </strong>
            {listing.condition}
          </div>
        </div>

        {/* Claimant Info */}
        {listing.status === "REQUESTED" && (
          <div className="p-4 rounded-2xl border border-amber-300 bg-amber-50 shadow-sm flex items-start gap-2.5 text-xs text-amber-900 font-medium">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-extrabold block text-amber-950 text-sm mb-0.5">
                ⏳ Waiting Store Manager Approval
              </strong>
              <span>Your reservation pass is active. Present this digital code at store pickup for handover confirmation.</span>
            </div>
          </div>
        )}

        {listing.status === "CONFIRMED" && (
          <div className="p-4 rounded-2xl border border-emerald-300 bg-emerald-50 shadow-sm flex items-start gap-2.5 text-xs text-emerald-950 font-medium">
            <PackageCheck className="w-5 h-5 text-[#00CC88] shrink-0 mt-0.5" />
            <div>
              <strong className="font-extrabold block text-[#004F38] text-sm mb-0.5">
                Rescued ✓ (Handover Completed)
              </strong>
              <span>This surplus bag was successfully collected and recorded in sustainability impact metrics.</span>
            </div>
          </div>
        )}

        {listing.claimRequest && listing.status !== "REQUESTED" && listing.status !== "CONFIRMED" && (
          <div className="p-4 rounded-2xl border border-[#00CC88]/40 bg-emerald-50/60 shadow-sm">
            <h3 className="font-bold text-xs text-[#004F38] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00CC88]" /> Matched Recipient
            </h3>
            <div className="text-xs text-[#0F172A]">
              <span className="font-extrabold block text-sm text-[#004F38]">
                {listing.claimRequest.ngoName || listing.claimRequest.buyerName || "Verified Recipient"}
              </span>
              {listing.claimRequest.buyerContact && (
                <span className="text-slate-600 flex items-center gap-1 mt-1 font-medium">
                  <Phone className="w-3.5 h-3.5" /> {listing.claimRequest.buyerContact}
                </span>
              )}
            </div>
          </div>
        )}

        {!listing.claimRequest && listing.status === "OPEN" && (
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-600 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Surplus bag is active & open for discovery near you.</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col gap-2 pt-4 border-t border-slate-200 mt-auto">
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

          {listing.status !== "CONFIRMED" &&
            listing.status !== "CANCELLED" &&
            listing.status !== "EXPIRED" &&
            onConfirmHandover && (
              <Button
                variant="donate"
                size="lg"
                onClick={handleConfirm}
                isLoading={isProcessing}
                className="w-full font-bold shadow-lg"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" /> Confirm Customer / Shelter Handover
              </Button>
            )}

          {listing.status === "CONFIRMED" && (
            <div className="p-3.5 rounded-xl bg-[#004F38] text-white text-xs text-center font-bold shadow-md flex items-center justify-center gap-2">
              <PackageCheck className="w-4 h-4 text-[#00CC88]" /> Handover Confirmed & Recorded in Impact History
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

