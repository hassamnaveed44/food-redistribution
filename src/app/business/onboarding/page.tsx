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
    category: "Bakery & Cafe",
    streetAddress: "",
    cityState: "",
    latitude: 40.7128,
    longitude: -74.006,
    docKey: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fullAddress = `${formData.streetAddress}, ${formData.cityState}`;
    try {
      await registerBusinessAction({
        businessName: `${formData.businessName} (${formData.category})`,
        address: fullAddress,
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
              Register your restaurant, bakery, grocery, or cafeteria profile
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Business / Store Name"
              placeholder="e.g. Artisan Crumbs Bakery"
              required
              value={formData.businessName}
              onChange={(e) =>
                setFormData({ ...formData, businessName: e.target.value })
              }
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#211D19]">
                Business Type / Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3DBC9] bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#B84A16]"
              >
                <option value="Bakery & Cafe">Bakery & Cafe</option>
                <option value="Restaurant & Bistro">Restaurant & Bistro</option>
                <option value="Grocery & Supermarket">Grocery & Supermarket</option>
                <option value="Hotel & Cafeteria">Hotel & Cafeteria</option>
              </select>
            </div>
          </div>

          <Input
            label="Street Address"
            placeholder="e.g. 124 Market Street, Suite 4"
            required
            value={formData.streetAddress}
            onChange={(e) =>
              setFormData({ ...formData, streetAddress: e.target.value })
            }
          />

          <Input
            label="City, State & Zip Code"
            placeholder="e.g. New York, NY 10001"
            required
            value={formData.cityState}
            onChange={(e) =>
              setFormData({ ...formData, cityState: e.target.value })
            }
          />

          <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-[#F5F1E8]/50 border border-[#E3DBC9]">
            <label className="text-xs font-bold text-[#211D19] flex items-center justify-between">
              <span>📍 Store GPS Coordinates & City Preset</span>
              <span className="text-[10px] text-[#B84A16] font-semibold">Select matching city for test NGO discovery</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, latitude: 40.7128, longitude: -74.006, cityState: "New York, NY 10001" })
                }
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E3DBC9] text-[11px] font-bold text-[#211D19] hover:bg-[#B84A16] hover:text-white transition-all shadow-sm"
              >
                🗽 New York
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, latitude: 32.5861, longitude: 73.4912, cityState: "Mandi Bahauddin, 50400" })
                }
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E3DBC9] text-[11px] font-bold text-[#211D19] hover:bg-[#B84A16] hover:text-white transition-all shadow-sm"
              >
                📍 Mandi Bahauddin
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, latitude: 51.5074, longitude: -0.1278, cityState: "London, UK" })
                }
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E3DBC9] text-[11px] font-bold text-[#211D19] hover:bg-[#B84A16] hover:text-white transition-all shadow-sm"
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
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E3DBC9] text-[11px] font-bold text-[#211D19] hover:bg-[#B84A16] hover:text-white transition-all shadow-sm"
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
              Verification Document (Business Permit / Health Certificate)
            </label>
            <div className="border-2 border-dashed border-[#E3DBC9] rounded-xl p-6 bg-[#F5F1E8]/30 flex flex-col items-center justify-center gap-2 hover:border-[#B84A16] transition-colors cursor-pointer">
              <UploadCloud className="w-8 h-8 text-[#B84A16]" />
              <span className="text-xs text-[#6B6157]">
                Click or drag PDF / Image file to upload document
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
