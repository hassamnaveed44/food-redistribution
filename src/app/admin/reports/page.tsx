import React from "react";
import Link from "next/link";
import { prisma } from "@/server/db/prisma";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  let reports: any[] = [];
  try {
    reports = await prisma.report.findMany({
      include: { listing: true, reportedBy: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.warn("AdminReports fallback:", e);
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
                Reported Issues & Resolution Workflow
              </h1>
              <span className="text-xs text-[#EFEAE0]/70">
                Platform Operations Resolution Logs
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-8">
        <div className="bg-white rounded-2xl border border-[#E3DBC9] p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-[#B3402F]" />
            <h2 className="font-serif text-xl font-semibold text-[#211D19]">
              Reported Issues Queue ({reports.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E3DBC9] text-[11px] font-semibold text-[#6B6157] uppercase">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Reported By</th>
                  <th className="py-3 px-4">Reason / Issue Details</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DBC9] text-xs">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#6B6157]">
                      No reported issues. Platform operations are running cleanly.
                    </td>
                  </tr>
                ) : (
                  reports.map((r) => (
                    <tr key={r.id} className="hover:bg-[#F5F1E8]/40">
                      <td className="py-3.5 px-4 font-mono text-[#6B6157]">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#211D19]">
                        {r.reportedBy?.fullName || "Anonymous User"}
                      </td>
                      <td className="py-3.5 px-4 text-[#211D19]">{r.reason}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#FDF8EF] text-[#8A5B00] border border-[#F3E2C8]">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
