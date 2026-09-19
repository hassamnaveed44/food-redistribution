"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, HeartHandshake, ShoppingBag, ShieldCheck } from "lucide-react";

export interface RoleSwitcherProps {
  isAdmin?: boolean;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ isAdmin = false }) => {
  const pathname = usePathname();

  const isBusiness = pathname.startsWith("/business");
  const isNgo = pathname.startsWith("/ngo");
  const isBuyer = pathname.startsWith("/buyer") || pathname === "/explore";
  const isAdminPath = pathname.startsWith("/admin");

  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
      <Link href="/business/console">
        <span
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
            isBusiness
              ? "bg-[#00CC88] text-[#004F38] shadow-sm font-extrabold"
              : "text-emerald-100 hover:bg-white/10 hover:text-white"
          }`}
          title="Store Partner Console"
        >
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden md:inline">Store Partner</span>
        </span>
      </Link>

      <Link href="/ngo/console">
        <span
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
            isNgo
              ? "bg-[#00CC88] text-[#004F38] shadow-sm font-extrabold"
              : "text-emerald-100 hover:bg-white/10 hover:text-white"
          }`}
          title="NGO & Shelter Relief Console"
        >
          <HeartHandshake className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden md:inline">NGO Shelter</span>
        </span>
      </Link>

      <Link href="/buyer/explore">
        <span
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
            isBuyer
              ? "bg-[#00CC88] text-[#004F38] shadow-sm font-extrabold"
              : "text-emerald-100 hover:bg-white/10 hover:text-white"
          }`}
          title="Food Rescuer Hub"
        >
          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden md:inline">Food Rescuer</span>
        </span>
      </Link>

      {isAdmin && (
        <Link href="/admin/dashboard">
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
              isAdminPath
                ? "bg-amber-400 text-slate-900 shadow-sm font-extrabold"
                : "text-amber-200 hover:bg-white/10 hover:text-white"
            }`}
            title="Admin Governance Console"
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline">Admin</span>
          </span>
        </Link>
      )}
    </div>
  );
};
