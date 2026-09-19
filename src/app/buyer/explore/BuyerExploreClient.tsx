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
  ShoppingBag,
  MapPin,
  Clock,
  Building2,
  Sparkles,
  CheckCircle2,
  Tag,
  Gift,
  Leaf,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

export interface BuyerExploreClientProps {
  initialListings: any[];
  userName: string;
}

export const BuyerExploreClient: React.FC<BuyerExploreClientProps> = ({
  initialListings,
  userName,
}) => {
  const [listings, setListings] = useState<any[]>(initialListings);
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [isRescuing, setIsRescuing] = useState(false);

  const filteredListings = listings.filter((l) => {
    if (categoryFilter === "BAGS") return l.outcome === "DISCOUNT";
    if (categoryFilter === "DONATE") return l.outcome === "DONATE";
    return true;
  });

  const handleRescueBag = async (listingId: string) => {
    setIsRescuing(true);
    try {
      await requestClaimAction({
        listingId,
        claimType: "PURCHASE",
      });
      setListings((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, status: "REQUESTED" } : l))
      );
      alert("🎉 Magic Bag Pass Reserved! Present your voucher token code at store pickup.");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error reserving magic bag");
    } finally {
      setIsRescuing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#0F172A] overflow-x-hidden w-full max-w-full">
      {/* Top Rescuer Portal Header */}
      <header className="bg-[#004F38] text-white border-b border-emerald-900 px-4 sm:px-6 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-[#00CC88] text-[#004F38] flex items-center justify-center font-extrabold text-xl shadow-md">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl text-white tracking-tight flex items-center gap-2 leading-snug">
                RescueBites Food Rescuer Hub
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#FFC72C] text-slate-900">
                  FOOD RESCUER
                </span>
              </h1>
              <span className="text-xs text-emerald-200/80 block">
                Welcome back, <strong>{userName}</strong> (Eco Rescuer)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-1 sm:pt-0 border-t border-emerald-800/60 sm:border-0">
            <RoleSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col gap-8">
        {/* Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#004F38] via-[#006648] to-[#004F38] text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00CC88]/20 border border-[#00CC88]/30 text-xs font-bold text-[#00CC88] mb-3">
              <Leaf className="w-3.5 h-3.5 text-[#00CC88]" />
              <span>INDIVIDUAL FOOD RESCUER PORTAL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Save Good Food. Save Money.
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Every day, top local bakeries & cafes release fresh unsold surplus as Surprise Magic Bags at <strong>60-70% discount</strong>. Reserve your voucher pass before closing!
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto z-10">
            <button
              onClick={() => setCategoryFilter("ALL")}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md ${
                categoryFilter === "ALL"
                  ? "bg-[#00CC88] text-[#004F38]"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              All Surplus ({listings.length})
            </button>
            <button
              onClick={() => setCategoryFilter("BAGS")}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md ${
                categoryFilter === "BAGS"
                  ? "bg-[#FF5A5F] text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              🛍️ Magic Bags (60-70% Off)
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-extrabold text-xl text-[#004F38] tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF5A5F]" /> Active Surplus Magic Bags Near You
            </h3>
            <span className="text-xs text-slate-500 font-bold">
              Showing {filteredListings.length} available items
            </span>
          </div>

          {filteredListings.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center flex flex-col items-center">
              <ShoppingBag className="w-12 h-12 text-slate-300 mb-3" />
              <h4 className="font-bold text-base text-slate-700">No surplus bags available right now</h4>
              <p className="text-xs text-slate-500 mt-1">Check back near store closing hours for fresh Surprise Bags!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredListings.map((item) => {
                const isClaimed = item.status === "REQUESTED" || item.status === "CONFIRMED";

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col"
                  >
                    {/* Header Badges */}
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#FAF9F6]">
                      <OutcomeBadge
                        outcome={item.outcome}
                        originalPrice={item.originalPrice}
                        discountPrice={item.discountPrice}
                        unit={item.unit}
                      />
                      <StatusPill status={item.status} quantityLeft={item.quantity} />
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col gap-3">
                      <div>
                        <h4 className="font-extrabold text-lg text-[#004F38] tracking-tight mb-1">
                          {item.foodType}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                          <Building2 className="w-3.5 h-3.5 text-[#FF5A5F]" />
                          <span>{item.businessName}</span>
                          <span className="text-slate-300">•</span>
                          <MapPin className="w-3.5 h-3.5 text-[#00CC88]" />
                          <span>0.4 km away</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-slate-100 text-xs text-slate-600 flex justify-between items-center">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold uppercase">
                            Quantity Left
                          </span>
                          <span className="font-extrabold text-[#004F38] text-sm">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 block text-[10px] font-bold uppercase">
                            Pickup Deadline
                          </span>
                          <span className="font-extrabold text-[#FF5A5F] flex items-center gap-1 text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(item.collectionDeadline).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                        "{item.condition}"
                      </p>
                    </div>

                    {/* Footer Buttons */}
                    <div className="p-5 pt-0 mt-auto flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1 text-xs py-2"
                        onClick={() => setSelectedListing(item)}
                      >
                        Details
                      </Button>

                      {item.status === "OPEN" ? (
                        <Button
                          variant={item.outcome === "DONATE" ? "donate" : "discount"}
                          size="sm"
                          className="flex-1 text-xs py-2 font-bold shadow-md"
                          disabled={isRescuing}
                          onClick={() => handleRescueBag(item.id)}
                        >
                          Rescue Bag
                        </Button>
                      ) : item.status === "REQUESTED" ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1 text-xs py-2 font-bold text-amber-900 bg-amber-50 border border-amber-300 opacity-90 cursor-not-allowed"
                          disabled
                        >
                          {item.claimRequest?.ngoName ? (
                            <span>Reserved by {item.claimRequest.ngoName}</span>
                          ) : (
                            <span>⏳ Waiting Approval</span>
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-xs py-2 font-bold text-[#004F38] bg-emerald-50 border border-emerald-300 opacity-90 cursor-not-allowed"
                          disabled
                        >
                          Rescued ✓
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <ListingDetailDrawer
        isOpen={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        listing={selectedListing}
      />
    </div>
  );
};
