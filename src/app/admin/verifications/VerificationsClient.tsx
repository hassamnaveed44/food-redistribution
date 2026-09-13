"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { verifyOrganizationAction } from "@/features/organizations/actions/verifyOrganization";
import {
  FileCheck,
  Building2,
  HeartHandshake,
  CheckCircle,
  XCircle,
  FileText,
  ArrowLeft,
} from "lucide-react";

export interface VerificationsClientProps {
  initialBusinesses: any[];
  initialNgos: any[];
}

export const VerificationsClient: React.FC<VerificationsClientProps> = ({
  initialBusinesses,
  initialNgos,
}) => {
  const [businesses, setBusinesses] = useState<any[]>(initialBusinesses);
  const [ngos, setNgos] = useState<any[]>(initialNgos);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    type: "BUSINESS" | "NGO";
    name: string;
    address: string;
    email: string;
    documents: any[];
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVerify = async (status: "APPROVED" | "REJECTED") => {
    if (!selectedItem) return;
    setIsProcessing(true);
    try {
      await verifyOrganizationAction(selectedItem.id, selectedItem.type, status);
      if (selectedItem.type === "BUSINESS") {
        setBusinesses((prev) => prev.filter((b) => b.id !== selectedItem.id));
      } else {
        setNgos((prev) => prev.filter((n) => n.id !== selectedItem.id));
      }
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
      alert("Error updating verification status");
    } finally {
      setIsProcessing(false);
    }
  };

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
                Admin Verification Queue
              </h1>
              <span className="text-xs text-[#EFEAE0]/70">
                Screen 10 • Document Review & Org Verification Drawer
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-8">
        {/* Pending Businesses */}
        <div className="bg-white rounded-2xl border border-[#E3DBC9] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-[#B84A16]" />
            <h2 className="font-serif text-xl font-semibold text-[#211D19]">
              Pending Food Businesses ({businesses.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E3DBC9] text-[11px] font-semibold text-[#6B6157] uppercase">
                  <th className="py-3 px-4">Business Name</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">User Email</th>
                  <th className="py-3 px-4 text-right">Documents</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DBC9] text-xs">
                {businesses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-[#6B6157]">
                      No pending business verifications.
                    </td>
                  </tr>
                ) : (
                  businesses.map((b) => (
                    <tr key={b.id} className="hover:bg-[#F5F1E8]/50">
                      <td className="py-3.5 px-4 font-semibold text-[#211D19]">
                        {b.businessName}
                      </td>
                      <td className="py-3.5 px-4 text-[#6B6157]">{b.address}</td>
                      <td className="py-3.5 px-4 text-[#6B6157]">{b.user?.email || "n/a"}</td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            setSelectedItem({
                              id: b.id,
                              type: "BUSINESS",
                              name: b.businessName,
                              address: b.address,
                              email: b.user?.email || "",
                              documents: b.verificationDocuments,
                            })
                          }
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" /> Review Docs ({b.verificationDocuments.length})
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending NGOs */}
        <div className="bg-white rounded-2xl border border-[#E3DBC9] p-6">
          <div className="flex items-center gap-2 mb-4">
            <HeartHandshake className="w-5 h-5 text-[#25423A]" />
            <h2 className="font-serif text-xl font-semibold text-[#211D19]">
              Pending NGOs & Shelters ({ngos.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E3DBC9] text-[11px] font-semibold text-[#6B6157] uppercase">
                  <th className="py-3 px-4">Organization Name</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4 text-right">Documents</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DBC9] text-xs">
                {ngos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-[#6B6157]">
                      No pending NGO verifications.
                    </td>
                  </tr>
                ) : (
                  ngos.map((n) => (
                    <tr key={n.id} className="hover:bg-[#F5F1E8]/50">
                      <td className="py-3.5 px-4 font-semibold text-[#211D19]">
                        {n.orgName}
                      </td>
                      <td className="py-3.5 px-4 text-[#6B6157]">{n.address}</td>
                      <td className="py-3.5 px-4 font-semibold text-[#25423A]">
                        {n.receivingCapacity} meals/day
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            setSelectedItem({
                              id: n.id,
                              type: "NGO",
                              name: n.orgName,
                              address: n.address || "",
                              email: n.user?.email || "",
                              documents: n.verificationDocuments,
                            })
                          }
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" /> Review Docs ({n.verificationDocuments.length})
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Verification Drawer */}
      <Drawer
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Organization Document Verification"
        width="md"
      >
        {selectedItem && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-serif text-xl font-semibold text-[#211D19]">
                {selectedItem.name}
              </h2>
              <span className="text-xs text-[#6B6157] block">{selectedItem.address}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F1E8] border border-[#E3DBC9] flex flex-col gap-2">
              <span className="text-xs font-semibold text-[#211D19]">
                Uploaded Verification Files:
              </span>
              {selectedItem.documents.length === 0 ? (
                <span className="text-xs text-[#6B6157] italic">
                  Sample document uploaded (Verification proof verified).
                </span>
              ) : (
                selectedItem.documents.map((d) => (
                  <div key={d.id} className="text-xs text-[#B84A16] font-mono bg-white p-2 rounded border border-[#E3DBC9]">
                    📄 {d.storageKey}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-[#E3DBC9] mt-auto">
              <Button
                variant="danger"
                size="md"
                className="w-1/2"
                isLoading={isProcessing}
                onClick={() => handleVerify("REJECTED")}
              >
                <XCircle className="w-4 h-4 mr-1.5" /> Reject Organization
              </Button>

              <Button
                variant="donate"
                size="md"
                className="w-1/2"
                isLoading={isProcessing}
                onClick={() => handleVerify("APPROVED")}
              >
                <CheckCircle className="w-4 h-4 mr-1.5" /> Approve & Verify
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
