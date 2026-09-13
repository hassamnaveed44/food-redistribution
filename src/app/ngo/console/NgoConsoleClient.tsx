"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/shared/StatusPill";
import { OutcomeBadge } from "@/components/shared/OutcomeBadge";
import { ListingDetailDrawer } from "@/features/listings/components/ListingDetailDrawer";
import { requestClaimAction } from "@/features/claims/actions/requestClaim";
import {
  HeartHandshake,
  MapPin,
  List,
  Map as MapIcon,
  Clock,
  Building2,
  History,
  ShieldCheck,
  Zap,
} from "lucide-react";

export interface NgoConsoleClientProps {
  ngoProfile: any;
  initialListings: any[];
  userName: string;
}

export const NgoConsoleClient: React.FC<NgoConsoleClientProps> = ({
  ngoProfile,
  initialListings,
  userName,
}) => {
  const [listings, setListings] = useState<any[]>(initialListings);
  const [viewMode, setViewMode] = useState<"LIST" | "MAP">("LIST");
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const activeRequests = listings.filter(
    (l) => l.claimRequest?.ngoProfileId === ngoProfile.id || l.status === "REQUESTED"
  );

  const handleRequestDonation = async (listingId: string) => {
    setIsRequesting(true);
    try {
      await requestClaimAction({
        listingId,
        claimType: "DONATION",
      });
      setListings((prev) =>
        prev.map((l) =>
          l.id === listingId ? { ...l, status: "REQUESTED" } : l
        )
      );
      alert("Donation claim request submitted successfully to business!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error requesting donation");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E8]">
      {/* Top Console Bar */}
      <header className="bg-white border-b border-[#E3DBC9] px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-[#25423A] text-white flex items-center justify-center font-bold text-lg font-serif">
              H
            </div>
            <div>
              <h1 className="font-serif font-semibold text-lg text-[#211D19]">
                NGO Discovery Console
              </h1>
              <span className="text-xs text-[#6B6157]">
                Screen 7 • {ngoProfile.orgName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/ngo/history">
              <Button variant="secondary" size="sm">
                <History className="w-4 h-4 mr-1.5" /> History & Impact
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Operational Body */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-8">
        {/* Top-Level Cards: Capacity & Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Capacity Meter */}
          <div className="p-5 rounded-2xl bg-white border border-[#E3DBC9] shadow-xs">
            <span className="text-xs font-medium text-[#6B6157] block mb-1">
              Daily Receiving Capacity
            </span>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-semibold text-[#25423A] tabular-nums">
                {ngoProfile.receivingCapacity} meals/day
              </span>
              <span className="text-xs text-[#2E6B45] font-medium bg-[#EBF5EE] px-2 py-0.5 rounded-full border border-[#C5E6D0]">
                Verified
              </span>
            </div>
            <div className="w-full bg-[#EFEAE0] h-2 rounded-full overflow-hidden">
              <div className="bg-[#25423A] h-full w-[45%]" />
            </div>
            <span className="text-[11px] text-[#6B6157] mt-2 block">
              45% capacity allocated today
            </span>
          </div>

          {/* Active Requests Pipeline */}
          <div className="p-5 rounded-2xl bg-white border border-[#E3DBC9] shadow-xs md:col-span-2 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#6B6157]">
                Active Request Pipeline
              </span>
              <span className="text-xs text-[#B84A16] font-medium">
                {activeRequests.length} active claims
              </span>
            </div>

            {activeRequests.length === 0 ? (
              <div className="text-xs text-[#6B6157] italic py-2">
                No pending requests. Select an available surplus donation below to submit a claim.
              </div>
            ) : (
              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {activeRequests.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => setSelectedListing(req)}
                    className="p-3 rounded-xl bg-[#F5F1E8] border border-[#E3DBC9] min-w-[220px] cursor-pointer hover:border-[#25423A] transition-colors"
                  >
                    <span className="font-semibold text-xs text-[#211D19] block truncate">
                      {req.foodType}
                    </span>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-[#6B6157]">
                        {req.quantity} {req.unit}
                      </span>
                      <StatusPill status={req.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Nearby Available Listings Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#211D19]">
                Nearby Available Surplus Food
              </h2>
              <p className="text-xs text-[#6B6157]">
                Matched by bounding-box location ({ngoProfile.address}) & receiving capacity
              </p>
            </div>

            {/* List / Map View Toggle */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E3DBC9]">
              <button
                onClick={() => setViewMode("LIST")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === "LIST"
                    ? "bg-[#25423A] text-white"
                    : "text-[#6B6157] hover:text-[#211D19]"
                }`}
              >
                <List className="w-3.5 h-3.5" /> List View
              </button>

              <button
                onClick={() => setViewMode("MAP")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === "MAP"
                    ? "bg-[#25423A] text-white"
                    : "text-[#6B6157] hover:text-[#211D19]"
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" /> Map View
              </button>
            </div>
          </div>

          {/* View Content */}
          {viewMode === "LIST" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#E3DBC9] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <OutcomeBadge
                        outcome={item.outcome}
                        originalPrice={item.originalPrice}
                        discountPrice={item.discountPrice}
                        unit={item.unit}
                      />
                      <StatusPill status={item.status} size="sm" />
                    </div>

                    <h3 className="font-serif font-semibold text-base text-[#211D19] mb-1">
                      {item.foodType}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-[#6B6157] mb-4">
                      <Building2 className="w-3.5 h-3.5 text-[#B84A16]" />
                      <span>{item.businessName || "Artisan Crumbs Bakery"}</span>
                      {item.distanceKm !== undefined && (
                        <span className="text-[#25423A] font-medium bg-[#25423A]/10 px-1.5 py-0.5 rounded text-[10px]">
                          {item.distanceKm} km away
                        </span>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-[#F5F1E8]/60 border border-[#E3DBC9] text-xs text-[#6B6157] mb-4 flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span>Surplus Quantity:</span>
                        <strong className="text-[#211D19]">
                          {item.quantity} {item.unit}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Deadline Window:</span>
                        <strong className="text-[#B8862B] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.collectionDeadline).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#E3DBC9]">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-1/2"
                      onClick={() => setSelectedListing(item)}
                    >
                      View Details
                    </Button>

                    {item.status === "OPEN" && item.outcome === "DONATE" ? (
                      <Button
                        variant="donate"
                        size="sm"
                        className="w-1/2"
                        isLoading={isRequesting}
                        onClick={() => handleRequestDonation(item.id)}
                      >
                        Request Donation
                      </Button>
                    ) : item.status === "OPEN" && item.outcome === "DISCOUNT" ? (
                      <Button
                        variant="discount"
                        size="sm"
                        className="w-1/2"
                        onClick={() => setSelectedListing(item)}
                      >
                        Reserve Sale
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" className="w-1/2" disabled>
                        Claimed
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E3DBC9] p-8 h-[450px] flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#25423A]/10 text-[#25423A] flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#211D19] mb-1">
                Interactive Bounding-Box Map
              </h3>
              <p className="text-xs text-[#6B6157] max-w-md leading-relaxed mb-4">
                Listings plotted by latitude and longitude within your search radius. Select markers on map to open listing drawer.
              </p>
              <div className="flex items-center gap-2">
                {listings.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setSelectedListing(l)}
                    className="px-3 py-1.5 rounded-lg bg-[#F5F1E8] border border-[#E3DBC9] text-xs font-medium text-[#25423A] hover:bg-[#25423A] hover:text-white transition-colors"
                  >
                    📍 {l.businessName} ({l.foodType})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Shared Detail Drawer */}
      <ListingDetailDrawer
        isOpen={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        listing={selectedListing}
      />
    </div>
  );
};
