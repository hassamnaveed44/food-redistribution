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
    orgCategory: "Homeless Shelter & Kitchen",
    streetAddress: "",
    cityState: "",
    receivingCapacity: 100,
    latitude: 40.7138,
    longitude: -74.001,
    docKey: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fullAddress = `${formData.streetAddress}, ${formData.cityState}`;
    try {
      await registerNgoAction({
        orgName: `${formData.orgName} (${formData.orgCategory})`,
        address: fullAddress,
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
              Register receiving capacity & non-profit verification details
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Organization / Shelter Name"
              placeholder="e.g. Hope Haven Community Shelter"
              required
              value={formData.orgName}
              onChange={(e) =>
                setFormData({ ...formData, orgName: e.target.value })
              }
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#211D19]">
                NGO Organization Type
              </label>
              <select
                value={formData.orgCategory}
                onChange={(e) =>
                  setFormData({ ...formData, orgCategory: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3DBC9] bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#25423A]"
              >
                <option value="Homeless Shelter & Kitchen">Homeless Shelter & Kitchen</option>
                <option value="Community Food Bank">Community Food Bank</option>
                <option value="Youth & Family Pantry">Youth & Family Pantry</option>
                <option value="Disaster Relief Shelter">Disaster Relief Shelter</option>
              </select>
            </div>
          </div>

          <Input
            label="Street Address / Facility Location"
            placeholder="e.g. 450 5th Avenue, Building B"
            required
            value={formData.streetAddress}
            onChange={(e) =>
              setFormData({ ...formData, streetAddress: e.target.value })
            }
          />

          <Input
            label="City, State & Zip Code"
            placeholder="e.g. New York, NY 10018"
            required
            value={formData.cityState}
            onChange={(e) =>
              setFormData({ ...formData, cityState: e.target.value })
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

          <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-[#F5F1E8]/50 border border-[#E3DBC9]">
            <label className="text-xs font-bold text-[#211D19] flex items-center justify-between">
              <span>📍 Shelter GPS Coordinates & City Preset</span>
              <span className="text-[10px] text-[#25423A] font-semibold">Select matching city for test store matching</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, latitude: 40.7138, longitude: -74.001, cityState: "New York, NY 10018" })
                }
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E3DBC9] text-[11px] font-bold text-[#211D19] hover:bg-[#25423A] hover:text-white transition-all shadow-sm"
              >
                🗽 New York
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, latitude: 32.5861, longitude: 73.4912, cityState: "Mandi Bahauddin, 50400" })
                }
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E3DBC9] text-[11px] font-bold text-[#211D19] hover:bg-[#25423A] hover:text-white transition-all shadow-sm"
              >
                📍 Mandi Bahauddin
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, latitude: 51.5074, longitude: -0.1278, cityState: "London, UK" })
                }
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E3DBC9] text-[11px] font-bold text-[#211D19] hover:bg-[#25423A] hover:text-white transition-all shadow-sm"
              >
                🎡 London
              </button>
              <button
                type="button"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      setFormData({
                        ...formData,
                        latitude: Math.round(pos.coords.latitude * 10000) / 10000,
                        longitude: Math.round(pos.coords.longitude * 10000) / 10000,
                      });
                    });
                  }
                }}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E3DBC9] text-[11px] font-bold text-[#211D19] hover:bg-[#25423A] hover:text-white transition-all shadow-sm"
              >
                ⚡ My GPS
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Latitude (Auto/GPS)"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({ ...formData, latitude: parseFloat(e.target.value) })
                }
              />
              <Input
                label="Longitude (Auto/GPS)"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({ ...formData, longitude: parseFloat(e.target.value) })
                }
              />
            </div>
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
