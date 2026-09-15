import React from "react";
import Link from "next/link";
import { prisma } from "@/server/db/prisma";
import { getCurrentUser } from "@/server/auth/guards";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/shared/StatusPill";
import { OutcomeBadge } from "@/components/shared/OutcomeBadge";
import { ArrowLeft, HeartHandshake, CheckCircle2, Utensils } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NgoHistoryPage() {
  const user = await getCurrentUser();

  let claims: any[] = [];
  try {
    claims = await prisma.claimRequest.findMany({
      orderBy: { requestedAt: "desc" },
      include: {
        listing: {
          include: { businessProfile: true },
        },
      },
    });
  } catch (e) {
    console.warn("NgoHistory fallback:", e);
  }

  const confirmedClaims = claims.filter((c) => c.listing?.status === "CONFIRMED");
  const totalMealsReceived = confirmedClaims.reduce(
    (sum, c) => sum + (c.listing?.quantity || 0),
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E8]">
      <header className="bg-white border-b border-[#E3DBC9] px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/ngo/console">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" /> Console
              </Button>
            </Link>
            <div>
              <h1 className="font-serif font-semibold text-lg text-[#211D19]">
                NGO Donation Impact & Request History
              </h1>
              <span className="text-xs text-[#6B6157]">Verified Non-Profit Partner Impact Log</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-[#E3DBC9]">
            <span className="text-xs text-[#6B6157] font-medium block">Total Meals Received</span>
            <div className="text-3xl font-semibold text-[#25423A] mt-1 flex items-center gap-2">
              <Utensils className="w-6 h-6 text-[#25423A]" />
              <span>{totalMealsReceived} meals</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E3DBC9]">
            <span className="text-xs text-[#6B6157] font-medium block">Confirmed Handovers</span>
            <div className="text-3xl font-semibold text-[#2E6B45] mt-1 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-[#2E6B45]" />
              <span>{confirmedClaims.length} batches</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E3DBC9]">
            <span className="text-xs text-[#6B6157] font-medium block">Total Claims Filed</span>
            <div className="text-3xl font-semibold text-[#211D19] mt-1">
              {claims.length} requests
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E3DBC9] p-6">
          <h2 className="font-serif text-xl font-semibold text-[#211D19] mb-4">
            Donation Request Pipeline History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E3DBC9] text-[11px] font-semibold text-[#6B6157] uppercase">
                  <th className="py-3 px-4">Requested At</th>
                  <th className="py-3 px-4">Food Batch</th>
                  <th className="py-3 px-4">Donor Business</th>
                  <th className="py-3 px-4">Claim Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DBC9] text-xs">
                {claims.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F5F1E8]/30">
                    <td className="py-3.5 px-4 text-[#6B6157] font-mono">
                      {new Date(c.requestedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#211D19]">
                      {c.listing?.foodType} ({c.listing?.quantity} {c.listing?.unit})
                    </td>
                    <td className="py-3.5 px-4 text-[#6B6157]">
                      {c.listing?.businessProfile?.businessName || "Artisan Crumbs"}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusPill status={c.listing?.status || "OPEN"} size="sm" />
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
