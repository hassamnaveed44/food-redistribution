import React from "react";
import Link from "next/link";
import { prisma } from "@/server/db/prisma";
import { Button } from "@/components/ui/Button";
import {
  ShieldAlert,
  Building2,
  HeartHandshake,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let pendingBusinesses = 0;
  let pendingNgos = 0;
  let totalListings = 0;
  let totalConfirmed = 0;
  let openReports = 0;

  try {
    pendingBusinesses = await prisma.businessProfile.count({
      where: { verificationStatus: "PENDING" },
    });
    pendingNgos = await prisma.ngoProfile.count({
      where: { verificationStatus: "PENDING" },
    });
    totalListings = await prisma.listing.count();
    totalConfirmed = await prisma.listing.count({
      where: { status: "CONFIRMED" },
    });
    openReports = await prisma.report.count({
      where: { status: "OPEN" },
    });
  } catch (e) {
    console.warn("AdminDashboard fallback:", e);
  }

  const totalPendingVerifications = pendingBusinesses + pendingNgos;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E8]">
      <header className="bg-[#211D19] text-white px-6 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#B84A16] flex items-center justify-center font-bold text-white font-serif">
              A
            </div>
            <div>
              <h1 className="font-serif font-semibold text-lg">
                Platform Admin Governance Console
              </h1>
              <span className="text-xs text-[#EFEAE0]/70">
                System Monitoring & Platform Governance
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin/verifications">
              <Button variant="primary" size="sm">
                <FileCheck className="w-4 h-4 mr-1.5" /> Verification Queue ({totalPendingVerifications})
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-8">
        {/* Platform KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Link href="/admin/verifications">
            <div className="p-5 rounded-2xl bg-white border border-[#E3DBC9] hover:border-[#B8862B] transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#6B6157] font-medium">Pending Verifications</span>
                <FileCheck className="w-4 h-4 text-[#B8862B]" />
              </div>
              <div className="text-3xl font-semibold text-[#B8862B] tabular-nums">
                {totalPendingVerifications}
              </div>
              <span className="text-[11px] text-[#6B6157] mt-1 block">
                {pendingBusinesses} businesses, {pendingNgos} NGOs
              </span>
            </div>
          </Link>

          <Link href="/admin/organizations">
            <div className="p-5 rounded-2xl bg-white border border-[#E3DBC9] hover:border-[#B84A16] transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#6B6157] font-medium">Total Listings Created</span>
                <Building2 className="w-4 h-4 text-[#B84A16]" />
              </div>
              <div className="text-3xl font-semibold text-[#211D19] tabular-nums">
                {totalListings}
              </div>
              <span className="text-[11px] text-[#6B6157] mt-1 block">Platform-wide total</span>
            </div>
          </Link>

          <div className="p-5 rounded-2xl bg-white border border-[#E3DBC9]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#6B6157] font-medium">Confirmed Handovers</span>
              <CheckCircle2 className="w-4 h-4 text-[#2E6B45]" />
            </div>
            <div className="text-3xl font-semibold text-[#2E6B45] tabular-nums">
              {totalConfirmed}
            </div>
            <span className="text-[11px] text-[#6B6157] mt-1 block">100% successful pickups</span>
          </div>

          <Link href="/admin/reports">
            <div className="p-5 rounded-2xl bg-white border border-[#E3DBC9] hover:border-[#B3402F] transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#6B6157] font-medium">Flagged Issues / Reports</span>
                <AlertTriangle className="w-4 h-4 text-[#B3402F]" />
              </div>
              <div className="text-3xl font-semibold text-[#B3402F] tabular-nums">
                {openReports}
              </div>
              <span className="text-[11px] text-[#6B6157] mt-1 block">Requires admin resolution</span>
            </div>
          </Link>
        </div>

        {/* Quick Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E3DBC9]">
            <h3 className="font-serif font-semibold text-lg text-[#211D19] mb-2">
              Verification Queue
            </h3>
            <p className="text-xs text-[#6B6157] leading-relaxed mb-4">
              Review 501(c)(3) tax proof and business health permits before granting platform access.
            </p>
            <Link href="/admin/verifications">
              <Button variant="primary" size="sm" className="w-full">
                Review Queue ({totalPendingVerifications}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E3DBC9]">
            <h3 className="font-serif font-semibold text-lg text-[#211D19] mb-2">
              Organizations & Listings
            </h3>
            <p className="text-xs text-[#6B6157] leading-relaxed mb-4">
              Tabbed data-table of all registered organizations and platform-wide surplus food batches.
            </p>
            <Link href="/admin/organizations">
              <Button variant="secondary" size="sm" className="w-full">
                Manage Organizations <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E3DBC9]">
            <h3 className="font-serif font-semibold text-lg text-[#211D19] mb-2">
              Reports & Issues
            </h3>
            <p className="text-xs text-[#6B6157] leading-relaxed mb-4">
              Resolution workflow for reported no-show pickups and food-safety concerns.
            </p>
            <Link href="/admin/reports">
              <Button variant="secondary" size="sm" className="w-full">
                Resolve Reports ({openReports}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
