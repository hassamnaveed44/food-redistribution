"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatusPill, ListingStatus } from "@/components/shared/StatusPill";
import { OutcomeBadge } from "@/components/shared/OutcomeBadge";
import { CreateListingModal } from "@/features/listings/components/CreateListingModal";
import { ListingDetailDrawer } from "@/features/listings/components/ListingDetailDrawer";
import { confirmPickupAction } from "@/features/claims/actions/confirmPickup";
import {
  Plus,
  Building2,
  Package,
  Gift,
  Tag,
  Clock,
  ChevronRight,
  Filter,
  BarChart3,
  LogOut,
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
    <div className="min-h-screen flex flex-col bg-[#F5F1E8]">
      {/* Top Console Navigation Bar */}
      <header className="bg-white border-b border-[#E3DBC9] px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-[#B84A16] text-white flex items-center justify-center font-bold text-lg font-serif">
              F
            </div>
            <div>
              <h1 className="font-serif font-semibold text-lg text-[#211D19]">
                Business Operational Console
              </h1>
              <span className="text-xs text-[#6B6157]">
                Screen 4 • Artisan Crumbs Bakery
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/business/reporting">
              <Button variant="secondary" size="sm">
                <BarChart3 className="w-4 h-4 mr-1.5" /> Reporting & Analytics
              </Button>
            </Link>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1.5" /> + New Listing
            </Button>
          </div>
        </div>
      </header>

      {/* Main Operational Surface */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-8">
        {/* Today's KPI Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white border border-[#E3DBC9] shadow-xs">
            <span className="text-xs text-[#6B6157] font-medium block">Active Surplus</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-semibold text-[#211D19] tabular-nums">
                {stats.totalActive}
              </span>
              <span className="text-xs text-[#6B6157]">batches open</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E3DBC9] shadow-xs">
            <span className="text-xs text-[#6B6157] font-medium block">Total Quantity</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-semibold text-[#211D19] tabular-nums">
                {stats.totalQuantity}
              </span>
              <span className="text-xs text-[#6B6157]">portions / units</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E3DBC9] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#6B6157] font-medium">Donations</span>
              <Gift className="w-4 h-4 text-[#25423A]" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-semibold text-[#25423A] tabular-nums">
                {stats.donateCount}
              </span>
              <span className="text-xs text-[#6B6157]">batches</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E3DBC9] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#6B6157] font-medium">Discounted Sales</span>
              <Tag className="w-4 h-4 text-[#2E5E8C]" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-semibold text-[#2E5E8C] tabular-nums">
                {stats.discountCount}
              </span>
              <span className="text-xs text-[#6B6157]">batches</span>
            </div>
          </div>
        </div>

        {/* Listings Data Table Section */}
        <div className="bg-white rounded-2xl border border-[#E3DBC9] overflow-hidden shadow-xs">
          {/* Table Toolbar & Filters */}
          <div className="px-6 py-4 border-b border-[#E3DBC9] bg-[#F5F1E8]/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#211D19] mr-2">Filter Outcome:</span>
              <button
                onClick={() => setFilterTab("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterTab === "ALL"
                    ? "bg-[#211D19] text-white"
                    : "bg-white border border-[#E3DBC9] text-[#6B6157] hover:bg-[#EFEAE0]"
                }`}
              >
                All Listings ({listings.length})
              </button>
              <button
                onClick={() => setFilterTab("DONATE")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterTab === "DONATE"
                    ? "bg-[#25423A] text-white"
                    : "bg-white border border-[#E3DBC9] text-[#6B6157] hover:bg-[#EFEAE0]"
                }`}
              >
                Donate Path
              </button>
              <button
                onClick={() => setFilterTab("DISCOUNT")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterTab === "DISCOUNT"
                    ? "bg-[#2E5E8C] text-white"
                    : "bg-white border border-[#E3DBC9] text-[#6B6157] hover:bg-[#EFEAE0]"
                }`}
              >
                Discount Path
              </button>
            </div>

            <span className="text-xs text-[#6B6157]">
              Click any row to open details drawer
            </span>
          </div>

          {/* Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E3DBC9] bg-[#EFEAE0]/40 text-[11px] font-semibold text-[#6B6157] uppercase tracking-wider">
                  <th className="py-3 px-6">Food Batch</th>
                  <th className="py-3 px-4">Outcome</th>
                  <th className="py-3 px-4">Qty / Unit</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DBC9] text-xs text-[#211D19]">
                {filteredListings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#6B6157]">
                      No surplus food listed yet. Click <strong>"+ New Listing"</strong> to post your first surplus batch.
                    </td>
                  </tr>
                ) : (
                  filteredListings.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedListing(item)}
                      className="hover:bg-[#F5F1E8]/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6 font-medium">
                        <div className="font-semibold text-[#211D19]">{item.foodType}</div>
                        <div className="text-[11px] text-[#6B6157]">{item.condition}</div>
                      </td>

                      <td className="py-4 px-4">
                        <OutcomeBadge
                          outcome={item.outcome}
                          originalPrice={item.originalPrice}
                          discountPrice={item.discountPrice}
                          unit={item.unit}
                        />
                      </td>

                      <td className="py-4 px-4 font-semibold tabular-nums">
                        {item.quantity} {item.unit}
                      </td>

                      <td className="py-4 px-4">
                        <StatusPill status={item.status} />
                      </td>

                      <td className="py-4 px-4 text-[#B8862B] font-medium">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(item.collectionDeadline).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right text-[#6B6157] group-hover:text-[#B84A16]">
                        <ChevronRight className="w-4 h-4 inline-block" />
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
