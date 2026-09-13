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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F1E8] p-4 py-12">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-sm border border-[#E3DBC9] flex flex-col">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-2xl font-semibold text-[#211D19] mb-1">
            Create your Account
          </h1>
          <p className="text-xs text-[#6B6157]">
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
                ? "border-[#B84A16] bg-[#B84A16]/5 text-[#B84A16] font-semibold"
                : "border-[#E3DBC9] bg-white text-[#6B6157] hover:border-[#B84A16]/50"
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-xs">Business</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("ngo")}
            className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
              selectedRole === "ngo"
                ? "border-[#25423A] bg-[#25423A]/5 text-[#25423A] font-semibold"
                : "border-[#E3DBC9] bg-white text-[#6B6157] hover:border-[#25423A]/50"
            }`}
          >
            <HeartHandshake className="w-5 h-5" />
            <span className="text-xs">NGO / Shelter</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("buyer")}
            className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
              selectedRole === "buyer"
                ? "border-[#2E5E8C] bg-[#2E5E8C]/5 text-[#2E5E8C] font-semibold"
                : "border-[#E3DBC9] bg-white text-[#6B6157] hover:border-[#2E5E8C]/50"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs">Buyer</span>
          </button>
        </div>

        <SignUp
          fallbackRedirectUrl="/redirect"
          unsafeMetadata={{
            role: selectedRole.toUpperCase(),
          }}
          appearance={{
            elements: {
              formButtonPrimary: "bg-[#B84A16] hover:bg-[#a14013] text-white text-xs",
              card: "shadow-none p-0 w-full",
            },
          }}
        />
      </div>
    </div>
  );
}
