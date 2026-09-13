import React from "react";
import Link from "next/link";
import { prisma } from "@/server/db/prisma";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/shared/StatusPill";
import { OutcomeBadge } from "@/components/shared/OutcomeBadge";
import { ArrowLeft, Building2, HeartHandshake, List } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrganizationsPage() {
  let businesses: any[] = [];
  let ngos: any[] = [];
  let listings: any[] = [];

  try {
    businesses = await prisma.businessProfile.findMany({
      include: { user: true, listings: true },
      orderBy: { createdAt: "desc" },
    });
    ngos = await prisma.ngoProfile.findMany({
      include: { user: true, claimRequests: true },
      orderBy: { createdAt: "desc" },
    });
    listings = await prisma.listing.findMany({
      include: { businessProfile: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.warn("AdminOrganizations fallback:", e);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E8]">
      <header className="bg-[#211D19] text-white px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="font-serif font-semibold text-lg">
                Organizations & Platform-Wide Listings
              </h1>
              <span className="text-xs text-[#EFEAE0]/70">
                Screen 11 • Tabbed Master Data Table
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-8">
        {/* All Registered Organizations */}
        <div className="bg-white rounded-2xl border border-[#E3DBC9] p-6">
          <h2 className="font-serif text-xl font-semibold text-[#211D19] mb-4">
            Registered Food Businesses ({businesses.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E3DBC9] text-[11px] font-semibold text-[#6B6157] uppercase">
                  <th className="py-3 px-4">Business Name</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Listings Posted</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DBC9] text-xs">
                {businesses.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F5F1E8]/30">
                    <td className="py-3.5 px-4 font-semibold text-[#211D19]">{b.businessName}</td>
                    <td className="py-3.5 px-4 text-[#6B6157]">{b.address}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#B84A16]">{b.listings.length} batches</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#EBF5EE] text-[#1B4D2E]">
                        {b.verificationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Platform Wide Listings */}
        <div className="bg-white rounded-2xl border border-[#E3DBC9] p-6">
          <h2 className="font-serif text-xl font-semibold text-[#211D19] mb-4">
            Platform-Wide Surplus Listings ({listings.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E3DBC9] text-[11px] font-semibold text-[#6B6157] uppercase">
                  <th className="py-3 px-4">Listing Batch</th>
                  <th className="py-3 px-4">Business</th>
                  <th className="py-3 px-4">Outcome</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DBC9] text-xs">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-[#F5F1E8]/30">
                    <td className="py-3.5 px-4 font-semibold text-[#211D19]">
                      {l.foodType} ({l.quantity} {l.unit})
                    </td>
                    <td className="py-3.5 px-4 text-[#6B6157]">
                      {l.businessProfile?.businessName || "Artisan Crumbs"}
                    </td>
                    <td className="py-3.5 px-4">
                      <OutcomeBadge outcome={l.outcome} />
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
