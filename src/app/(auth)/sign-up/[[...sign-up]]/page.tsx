"use client";

import React, { useState } from "react";
import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Building2, HeartHandshake, ShoppingBag } from "lucide-react";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "business";
  const [selectedRole, setSelectedRole] = useState<string>(initialRole);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] p-4 py-12">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80 flex flex-col">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-[#004F38] mb-1">
            Create your RescueBites Account
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Select your organization type to customize your platform console.
          </p>
        </div>

        {/* Inline Role Picker */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setSelectedRole("business")}
            className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
              selectedRole === "business"
                ? "border-[#004F38] bg-[#004F38]/10 text-[#004F38] font-extrabold"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#004F38]/50"
            }`}
          >
            <Building2 className="w-5 h-5 text-[#004F38]" />
            <span className="text-xs">Business</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("ngo")}
            className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
              selectedRole === "ngo"
                ? "border-[#00CC88] bg-[#00CC88]/10 text-[#004F38] font-extrabold"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#00CC88]/50"
            }`}
          >
            <HeartHandshake className="w-5 h-5 text-[#00CC88]" />
            <span className="text-xs">NGO / Shelter</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("buyer")}
            className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
              selectedRole === "buyer"
                ? "border-[#FF5A5F] bg-[#FF5A5F]/10 text-[#FF5A5F] font-extrabold"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#FF5A5F]/50"
            }`}
          >
            <ShoppingBag className="w-5 h-5 text-[#FF5A5F]" />
            <span className="text-xs">Food Rescuer</span>
          </button>
        </div>

        <SignUp
          forceRedirectUrl="/redirect"
          fallbackRedirectUrl="/redirect"
          unsafeMetadata={{
            role: selectedRole.toUpperCase(),
          }}
          appearance={{
            elements: {
              formButtonPrimary: "bg-[#004F38] hover:bg-[#003828] text-white text-xs font-bold",
              card: "shadow-none p-0 w-full",
            },
          }}
        />
      </div>
    </div>
  );
}
