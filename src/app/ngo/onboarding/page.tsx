"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerNgoAction } from "@/features/organizations/actions/registerNgo";
import { HeartHandshake, UploadCloud, Clock } from "lucide-react";

export default function NgoOnboardingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    orgName: "",
    address: "",
    receivingCapacity: 100,
    latitude: 40.7138,
    longitude: -74.001,
    docKey: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await registerNgoAction({
        orgName: formData.orgName,
        address: formData.address,
        receivingCapacity: Number(formData.receivingCapacity),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        documentStorageKey: formData.docKey || "doc_ngo_501c3_sample.pdf",
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Error submitting NGO onboarding form");
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
            Your NGO registration documents have been submitted to the admin verification queue. You can browse nearby available food while your verification is finalized.
          </p>
          <Button
            variant="donate"
            className="w-full"
            onClick={() => router.push("/ngo/console")}
          >
            Go to NGO Console
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F1E8] p-4 py-12">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-sm border border-[#E3DBC9]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E3DBC9]">
          <div className="w-10 h-10 rounded-lg bg-[#25423A] text-white flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-semibold text-[#211D19]">
              NGO & Shelter Verification Setup
            </h1>
            <p className="text-xs text-[#6B6157]">
              Register receiving capacity & non-profit verification
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Organization / Shelter Name"
            placeholder="e.g. Hope Haven Community Shelter"
            required
            value={formData.orgName}
            onChange={(e) =>
              setFormData({ ...formData, orgName: e.target.value })
            }
          />

          <Input
            label="Facility Address"
            placeholder="e.g. 450 5th Avenue, Midtown"
            required
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />

          <Input
            label="Daily Meal / Receiving Capacity (meals/day)"
            type="number"
            required
            value={formData.receivingCapacity}
            onChange={(e) =>
              setFormData({
                ...formData,
                receivingCapacity: parseInt(e.target.value) || 0,
              })
            }
            helperText="Used by matching engine to match listing quantities to your capacity"
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
              Non-Profit Status Proof (501(c)(3) or Charity Registration)
            </label>
            <div className="border-2 border-dashed border-[#E3DBC9] rounded-xl p-6 bg-[#F5F1E8]/30 flex flex-col items-center justify-center gap-2 hover:border-[#25423A] transition-colors cursor-pointer">
              <UploadCloud className="w-8 h-8 text-[#25423A]" />
              <span className="text-xs text-[#6B6157]">
                Click or drag PDF / Image file to upload document
              </span>
            </div>
          </div>

          <Button
            type="submit"
            variant="donate"
            size="lg"
            isLoading={isSubmitting}
            className="mt-4"
          >
            Submit NGO Verification
          </Button>
        </form>
      </div>
    </div>
  );
}
