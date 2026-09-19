"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, HeartHandshake, ShoppingBag, ShieldCheck, PlusCircle } from "lucide-react";

export interface RoleSwitcherProps {
  userRole?: "BUSINESS" | "NGO" | "BUYER" | "ADMIN" | string;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ userRole }) => {
  const pathname = usePathname();

  const isBusinessPath = pathname.startsWith("/business");
  const isNgoPath = pathname.startsWith("/ngo");
  const isBuyerPath = pathname.startsWith("/buyer") || pathname === "/explore";

  return (
    <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
      {/* If inside Business Console */}
      {isBusinessPath && (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00CC88] text-[#004F38] shadow-sm font-extrabold">
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <span>Store Manager Portal</span>
        </span>
      )}

      {/* If inside NGO Console */}
      {isNgoPath && (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00CC88] text-[#004F38] shadow-sm font-extrabold">
          <HeartHandshake className="w-3.5 h-3.5 shrink-0" />
          <span>Verified NGO Portal</span>
        </span>
      )}

      {/* If inside Rescuer Hub */}
      {isBuyerPath && (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00CC88] text-[#004F38] shadow-sm font-extrabold">
          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
          <span>Food Rescuer Hub</span>
        </span>
      )}

      {/* Optional registration link for individual buyers to onboard as store or NGO */}
      {userRole === "BUYER" && isBuyerPath && (
        <Link href="/business/onboarding">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-emerald-100 hover:bg-white/10 hover:text-white transition-all cursor-pointer">
            <PlusCircle className="w-3.5 h-3.5 text-[#00CC88]" />
            <span className="hidden md:inline">List Your Store</span>
          </span>
        </Link>
      )}
    </div>
  );
};
