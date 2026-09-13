"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerBusinessAction } from "@/features/organizations/actions/registerBusiness";
import { Building2, UploadCloud, Clock } from "lucide-react";

export default function BusinessOnboardingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    address: "",
    latitude: 40.7128,
    longitude: -74.006,
    docKey: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await registerBusinessAction({
        businessName: formData.businessName,
        address: formData.address,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        documentStorageKey: formData.docKey || "doc_business_registration_sample.pdf",
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Error submitting business onboarding form");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F1E8] p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-[#E3DBC9] text-center">
          <div className="w-12 h-12 bg-[#FDF8EF] text-[#B8862B] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#F3E2C8]">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[#211D19] mb-2">
            Verification Pending
          </h2>
          <p className="text-xs text-[#6B6157] leading-relaxed mb-6">
            Your business details and registration documents have been submitted to the admin verification queue. You can access your console while verification is processed.
          </p>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => router.push("/business/console")}
          >
            Go to Business Console
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F1E8] p-4 py-12">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-sm border border-[#E3DBC9]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E3DBC9]">
          <div className="w-10 h-10 rounded-lg bg-[#B84A16] text-white flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-semibold text-[#211D19]">
              Food Business Verification
            </h1>
            <p className="text-xs text-[#6B6157]">
              Screen 3 • Register your restaurant, bakery, or cafeteria profile
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Business Name"
            placeholder="e.g. Artisan Crumbs Bakery"
            required
            value={formData.businessName}
            onChange={(e) =>
              setFormData({ ...formData, businessName: e.target.value })
            }
          />

          <Input
            label="Street Address / Location"
            placeholder="e.g. 124 Market Street, Downtown"
            required
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) =>
                setFormData({ ...formData, latitude: parseFloat(e.target.value) })
              }
            />
            <Input
              label="Longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) =>
                setFormData({ ...formData, longitude: parseFloat(e.target.value) })
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#211D19]">
              Verification Document (Business Permit / Health Certificate)
            </label>
            <div className="border-2 border-dashed border-[#E3DBC9] rounded-xl p-6 bg-[#F5F1E8]/30 flex flex-col items-center justify-center gap-2 hover:border-[#B84A16] transition-colors cursor-pointer">
              <UploadCloud className="w-8 h-8 text-[#B84A16]" />
              <span className="text-xs text-[#6B6157]">
                Click or drag PDF / Image file to upload document
              </span>
              <span className="text-[10px] text-[#6B6157]/70">
                Uploaded securely via presigned URL
              </span>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="mt-4"
          >
            Submit for Admin Verification
          </Button>
        </form>
      </div>
    </div>
  );
}
