"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/shared/StatusPill";
import { OutcomeBadge } from "@/components/shared/OutcomeBadge";
import { ListingDetailDrawer } from "@/features/listings/components/ListingDetailDrawer";
import { RoleSwitcher } from "@/components/shared/RoleSwitcher";
import { requestClaimAction } from "@/features/claims/actions/requestClaim";
import {
  Sparkles,
  MapPin,
  List,
  Map as MapIcon,
  Clock,
  Building2,
  History,
  CheckCircle2,
  Filter,
  Flame,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

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
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const activeRequests = listings.filter(
    (l) => l.claimRequest?.ngoProfileId === ngoProfile.id || l.status === "REQUESTED"
  );

  const filteredListings = listings.filter((l) => {
    if (categoryFilter === "BAGS") return l.outcome === "DISCOUNT";
    if (categoryFilter === "DONATE") return l.outcome === "DONATE";
    return true;
  });

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
      alert("🎉 Donation claim request submitted! The store manager will confirm your pickup.");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error requesting donation");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#0F172A] overflow-x-hidden w-full max-w-full">
      {/* Top TGTG Console Header */}
      <header className="bg-[#004F38] text-white border-b border-emerald-900 px-4 sm:px-6 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-[#00CC88] text-[#004F38] flex items-center justify-center font-extrabold text-lg sm:text-xl shadow-md">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-xl text-white tracking-tight flex items-center flex-wrap gap-2 leading-snug">
                RescueBites NGO Discovery
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#00CC88] text-[#004F38]">
                  VERIFIED SHELTER
                </span>
              </h1>
              <span className="text-xs text-emerald-200/80 block">
                Logged in as <strong>{ngoProfile.orgName || userName}</strong> ({ngoProfile.address})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-1 sm:pt-0 border-t border-emerald-800/60 sm:border-0">
            <RoleSwitcher />

            <Link href="/ngo/history">
              <Button variant="donate" size="sm" className="shadow-md text-xs py-1.5 px-3">
                <History className="w-3.5 h-3.5 mr-1.5" /> History & Impact
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-8">
        {/* Daily Capacity & Pipeline Widget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Capacity Progress */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-lg">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Daily Shelter Meal Capacity
            </span>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-3xl font-extrabold text-[#004F38] tabular-nums">
                {ngoProfile.receivingCapacity} <span className="text-sm font-semibold text-slate-600">meals/day</span>
              </span>
              <span className="text-xs text-[#004F38] font-extrabold bg-[#00CC88]/20 px-2.5 py-1 rounded-full border border-[#00CC88]/40 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00CC88]" /> Verified
              </span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div className="bg-[#00CC88] h-full rounded-full w-[55%] shadow-sm" />
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-2 block">
              ⚡ 55% capacity active for today&apos;s food rescue
            </span>
          </div>

          {/* Active Claim Pipeline */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-lg md:col-span-2 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Active Food Claims & Reservations
              </span>
              <span className="text-xs text-[#FF5A5F] font-extrabold bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                {activeRequests.length} Active Claims
              </span>
            </div>

            {activeRequests.length === 0 ? (
              <div className="text-xs text-slate-500 italic py-3 bg-[#FAF9F6] rounded-xl px-4 border border-dashed border-slate-200">
                No active claims in progress. Browse nearby Surprise Magic Bags or 100% Free Donations below to reserve.
              </div>
            ) : (
              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {activeRequests.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => setSelectedListing(req)}
                    className="p-3.5 rounded-xl bg-[#FAF9F6] border border-slate-200 min-w-[240px] cursor-pointer hover:border-[#00CC88] hover:shadow-md transition-all"
                  >
                    <span className="font-bold text-xs text-[#004F38] block truncate mb-1">
                      {req.foodType}
                    </span>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] font-semibold text-slate-600">
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

        {/* Discovery Filter Controls */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-[#004F38] tracking-tight flex items-center gap-2">
                <Flame className="w-6 h-6 text-[#FF5A5F]" /> Active Surplus Near You
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Location-matched within search radius of <strong>{ngoProfile.address}</strong>
              </p>
            </div>

            {/* Category Filter Pills & View Mode */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                <button
                  onClick={() => setCategoryFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    categoryFilter === "ALL"
                      ? "bg-[#004F38] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All ({listings.length})
                </button>
                <button
                  onClick={() => setCategoryFilter("BAGS")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    categoryFilter === "BAGS"
                      ? "bg-[#FF5A5F] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ✨ Surprise Bags
                </button>
                <button
                  onClick={() => setCategoryFilter("DONATE")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    categoryFilter === "DONATE"
                      ? "bg-[#00CC88] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🎁 Free Donations
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                <button
                  onClick={() => setViewMode("LIST")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === "LIST"
                      ? "bg-[#004F38] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <List className="w-3.5 h-3.5" /> List
                </button>
                <button
                  onClick={() => setViewMode("MAP")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === "MAP"
                      ? "bg-[#004F38] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" /> Map
                </button>
              </div>
            </div>
          </div>

          {/* Listing Grid / Map View */}
          {viewMode === "LIST" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <OutcomeBadge
                        outcome={item.outcome}
                        originalPrice={item.originalPrice}
                        discountPrice={item.discountPrice}
                        unit={item.unit}
                      />
                      <StatusPill status={item.status} size="sm" quantityLeft={item.quantity} />
                    </div>

                    <h3 className="font-extrabold text-lg text-[#004F38] mb-1 group-hover:text-[#00CC88] transition-colors">
                      {item.foodType}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-4 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-[#FF5A5F]" />
                      <span>{item.businessName || "Artisan Bakery"}</span>
                      {item.distanceKm !== undefined && (
                        <span className="text-[#004F38] font-bold bg-[#00CC88]/20 px-2 py-0.5 rounded-full text-[10px]">
                          📍 {item.distanceKm} km away
                        </span>
                      )}
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-slate-200 text-xs text-slate-600 mb-4 flex flex-col gap-1.5">
                      <div className="flex justify-between">
                        <span>Quantity Available:</span>
                        <strong className="text-[#004F38] font-bold">
                          {item.quantity} {item.unit}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Collection Window:</span>
                        <strong className="text-[#FF5A5F] flex items-center gap-1 font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(item.collectionDeadline).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-1/2 text-xs"
                      onClick={() => setSelectedListing(item)}
                    >
                      Details
                    </Button>

                    {item.status === "OPEN" && item.outcome === "DONATE" ? (
                      <Button
                        variant="donate"
                        size="sm"
                        className="w-1/2 text-xs"
                        isLoading={isRequesting}
                        onClick={() => handleRequestDonation(item.id)}
                      >
                        Claim Free
                      </Button>
                    ) : item.status === "OPEN" && item.outcome === "DISCOUNT" ? (
                      <Button
                        variant="discount"
                        size="sm"
                        className="w-1/2 text-xs"
                        onClick={() => setSelectedListing(item)}
                      >
                        Reserve Bag
                      </Button>
                    ) : item.status === "REQUESTED" ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-1/2 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 opacity-90 cursor-not-allowed"
                        disabled
                      >
                        {item.claimRequest?.buyerName ? (
                          <span>Reserved by {item.claimRequest.buyerName}</span>
                        ) : item.claimRequest?.ngoName ? (
                          <span>Reserved by {item.claimRequest.ngoName}</span>
                        ) : (
                          <span>⏳ Waiting Approval</span>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-1/2 text-xs font-bold text-[#004F38] bg-emerald-50 border border-emerald-300 opacity-90 cursor-not-allowed"
                        disabled
                      >
                        Rescued ✓
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 h-[480px] flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-[#004F38] text-[#00CC88] flex items-center justify-center mb-4 shadow-md">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-[#004F38] mb-2">
                Interactive Food Discovery Map
              </h3>
              <p className="text-xs text-slate-600 max-w-md leading-relaxed mb-6 font-medium">
                Bounding-box map displaying active stores and Surprise Magic Bags around {ngoProfile.address}. Click a pin to open the claim drawer!
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {filteredListings.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setSelectedListing(l)}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-slate-200 text-xs font-bold text-[#004F38] hover:bg-[#004F38] hover:text-white transition-all shadow-sm flex items-center gap-1.5"
                  >
                    📍 {l.businessName} • {l.foodType}
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

