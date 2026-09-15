import React from "react";
import Link from "next/link";
import { prisma } from "@/server/db/prisma";
import { getCurrentUser } from "@/server/auth/guards";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/shared/StatusPill";
import { OutcomeBadge } from "@/components/shared/OutcomeBadge";
import {
  BarChart3,
  TrendingDown,
  Gift,
  Tag,
  ArrowLeft,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BusinessReportingPage() {
  const user = await getCurrentUser();

  let listings: any[] = [];
  try {
    listings = await prisma.listing.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        claimRequests: {
          include: { ngoProfile: true, buyerProfile: true },
        },
      },
    });
  } catch (e) {
    console.warn("Reporting page fallback:", e);
  }

  const confirmedListings = listings.filter((l) => l.status === "CONFIRMED");
  const totalMealsSaved = listings.reduce((sum, l) => sum + l.quantity, 0);
  const totalDonateCount = listings.filter((l) => l.outcome === "DONATE").length;
  const totalDiscountCount = listings.filter((l) => l.outcome === "DISCOUNT").length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#0F172A] overflow-x-hidden w-full max-w-full">
      <header className="bg-[#004F38] text-white border-b border-emerald-900 px-6 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/business/console">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-1" /> Console
              </Button>
            </Link>
            <div>
              <h1 className="font-extrabold text-xl text-white tracking-tight flex items-center gap-2">
                Business Waste Reduction & ESG Audit Report
              </h1>
              <span className="text-xs text-emerald-200/80 block">
                Verified Environmental Redistribution History
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-8">
        {/* Analytics KPI Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#E3DBC9]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#6B6157] font-medium">Estimated Food Saved</span>
              <TrendingDown className="w-4 h-4 text-[#2E6B45]" />
            </div>
            <div className="text-3xl font-semibold text-[#211D19] tabular-nums">
              {totalMealsSaved} <span className="text-xs font-normal text-[#6B6157]">kg / meals</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E3DBC9]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#6B6157] font-medium">Completed Handovers</span>
              <CheckCircle2 className="w-4 h-4 text-[#2E6B45]" />
            </div>
            <div className="text-3xl font-semibold text-[#2E6B45] tabular-nums">
              {confirmedListings.length} <span className="text-xs font-normal text-[#6B6157]">batches</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E3DBC9]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#6B6157] font-medium">Donations Redirected</span>
              <Gift className="w-4 h-4 text-[#25423A]" />
            </div>
            <div className="text-3xl font-semibold text-[#25423A] tabular-nums">
              {totalDonateCount} <span className="text-xs font-normal text-[#6B6157]">batches</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E3DBC9]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#6B6157] font-medium">Discount Sales Value</span>
              <Tag className="w-4 h-4 text-[#2E5E8C]" />
            </div>
            <div className="text-3xl font-semibold text-[#2E5E8C] tabular-nums">
              {totalDiscountCount} <span className="text-xs font-normal text-[#6B6157]">sales</span>
            </div>
          </div>
        </div>

        {/* History Data Table */}
        <div className="bg-white rounded-2xl border border-[#E3DBC9] p-6">
          <h2 className="font-serif text-xl font-semibold text-[#211D19] mb-4">
            Surplus Redistribution Audit History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E3DBC9] text-[11px] font-semibold text-[#6B6157] uppercase">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Surplus Batch</th>
                  <th className="py-3 px-4">Outcome</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Final Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DBC9] text-xs">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-[#F5F1E8]/30">
                    <td className="py-3.5 px-4 font-mono text-[#6B6157]">
                      {new Date(l.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#211D19]">
                      {l.foodType} ({l.quantity} {l.unit})
                    </td>
                    <td className="py-3.5 px-4">
                      <OutcomeBadge outcome={l.outcome} />
                    </td>
                    <td className="py-3.5 px-4 text-[#6B6157]">
                      {l.claimRequests[0]?.ngoProfile?.orgName ||
                        l.claimRequests[0]?.buyerProfile?.name ||
                        "Open Discovery"}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusPill status={l.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
