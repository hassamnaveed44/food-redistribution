"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/shared/StatusPill";
import { OutcomeBadge } from "@/components/shared/OutcomeBadge";
import { CreateListingModal } from "@/features/listings/components/CreateListingModal";
import { ListingDetailDrawer } from "@/features/listings/components/ListingDetailDrawer";
import { confirmPickupAction } from "@/features/claims/actions/confirmPickup";
import {
  Plus,
  Building2,
  Gift,
  Tag,
  Clock,
  ChevronRight,
  BarChart3,
  Sparkles,
  Leaf,
  TrendingUp,
  Flame,
} from "lucide-react";

export interface BusinessConsoleClientProps {
  initialListings: any[];
  stats: {
    totalActive: number;
    donateCount: number;
    discountCount: number;
    totalQuantity: number;
  };
  userName: string;
}

export const BusinessConsoleClient: React.FC<BusinessConsoleClientProps> = ({
  initialListings,
  stats,
  userName,
}) => {
  const [listings, setListings] = useState<any[]>(initialListings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [filterTab, setFilterTab] = useState<"ALL" | "DONATE" | "DISCOUNT">("ALL");

  const filteredListings = listings.filter((l) => {
    if (filterTab === "DONATE") return l.outcome === "DONATE";
    if (filterTab === "DISCOUNT") return l.outcome === "DISCOUNT";
    return true;
  });

  const handleConfirmHandover = async (listingId: string) => {
    try {
      await confirmPickupAction(listingId);
      setListings((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, status: "CONFIRMED" } : l))
      );
    } catch (err) {
      console.error(err);
      alert("Error confirming handover");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#0F172A] overflow-x-hidden w-full max-w-full">
      {/* Top Store Manager Console Header */}
      <header className="bg-[#004F38] text-white border-b border-emerald-900 px-4 sm:px-6 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-[#00CC88] text-[#004F38] flex items-center justify-center font-extrabold text-lg sm:text-xl shadow-md">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-xl text-white tracking-tight flex items-center gap-2 leading-snug">
                RescueBites Store Partner Console
              </h1>
              <span className="text-xs text-emerald-200/80 block">
                Store Manager: <strong>{userName || "Artisan Crumbs Bakery"}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 w-full sm:w-auto justify-start sm:justify-end pt-1 sm:pt-0 border-t border-emerald-800/60 sm:border-0">
            <Link href="/business/reporting">
              <Button variant="secondary" size="sm" className="shadow-sm text-xs py-1.5 px-3">
                <BarChart3 className="w-3.5 h-3.5 mr-1.5" /> Environmental Reporting
              </Button>
            </Link>

            <Button
              variant="donate"
              size="sm"
              className="shadow-lg font-bold text-xs py-1.5 px-3"
              onClick={() => setIsModalOpen(true)}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-200" /> + Release Surprise Bag
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-8">
        {/* Store Performance KPI Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-md">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <span>Active Surplus</span>
              <Flame className="w-4 h-4 text-[#FF5A5F]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#004F38] tabular-nums">
                {stats.totalActive}
              </span>
              <span className="text-xs text-slate-500 font-semibold">open batches</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-md">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <span>Food Saved</span>
              <TrendingUp className="w-4 h-4 text-[#00CC88]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#004F38] tabular-nums">
                {stats.totalQuantity * 2.5} kg
              </span>
              <span className="text-xs text-slate-500 font-semibold">rescued</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-md">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <span>CO₂ Emissions Prevented</span>
              <Leaf className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-600 tabular-nums">
                {Math.round(stats.totalQuantity * 6.2)} kg
              </span>
              <span className="text-xs text-slate-500 font-semibold">offset</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-md">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <span>Revenue Recovered</span>
              <Tag className="w-4 h-4 text-[#FF5A5F]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#FF5A5F] tabular-nums">
                ${stats.discountCount * 18.5}
              </span>
              <span className="text-xs text-slate-500 font-semibold">recovered</span>
            </div>
          </div>
        </div>

        {/* Listings Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-lg">
          {/* Table Toolbar */}
          <div className="px-6 py-4.5 border-b border-slate-100 bg-[#FAF9F6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#004F38] uppercase tracking-wider mr-2">Filter Outcome:</span>
              <button
                onClick={() => setFilterTab("ALL")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  filterTab === "ALL"
                    ? "bg-[#004F38] text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                All ({listings.length})
              </button>
              <button
                onClick={() => setFilterTab("DISCOUNT")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  filterTab === "DISCOUNT"
                    ? "bg-[#FF5A5F] text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                ✨ Surprise Magic Bags ({stats.discountCount})
              </button>
              <button
                onClick={() => setFilterTab("DONATE")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  filterTab === "DONATE"
                    ? "bg-[#00CC88] text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                🎁 Free NGO Donations ({stats.donateCount})
              </button>
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Click any row to confirm customer/shelter pickup handover
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-[#004F38]/5 text-[11px] font-extrabold text-[#004F38] uppercase tracking-wider">
                  <th className="py-3.5 px-6">Surplus Food Batch</th>
                  <th className="py-3.5 px-4">Outcome Path</th>
                  <th className="py-3.5 px-4">Units Available</th>
                  <th className="py-3.5 px-4">Live Status</th>
                  <th className="py-3.5 px-4">Collection Window</th>
                  <th className="py-3.5 px-6 text-right">Handover</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-[#0F172A]">
                {filteredListings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No active surplus listed yet. Click <strong>"+ Release Surprise Bag"</strong> to post unsold inventory in 30 seconds.
                    </td>
                  </tr>
                ) : (
                  filteredListings.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedListing(item)}
                      className="hover:bg-[#FAF9F6] transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6 font-medium">
                        <div className="font-extrabold text-[#004F38] text-sm">{item.foodType}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{item.condition}</div>
                      </td>

                      <td className="py-4 px-4">
                        <OutcomeBadge
                          outcome={item.outcome}
                          originalPrice={item.originalPrice}
                          discountPrice={item.discountPrice}
                          unit={item.unit}
                        />
                      </td>

                      <td className="py-4 px-4 font-bold tabular-nums text-sm text-[#004F38]">
                        {item.quantity} {item.unit}
                      </td>

                      <td className="py-4 px-4">
                        <StatusPill status={item.status} quantityLeft={item.quantity} />
                      </td>

                      <td className="py-4 px-4 text-[#FF5A5F] font-bold">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(item.collectionDeadline).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right text-slate-400 group-hover:text-[#00CC88]">
                        <ChevronRight className="w-5 h-5 inline-block" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal and Shared Drawer */}
      <CreateListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => window.location.reload()}
      />

      <ListingDetailDrawer
        isOpen={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        listing={selectedListing}
        onConfirmHandover={handleConfirmHandover}
      />
    </div>
  );
};

