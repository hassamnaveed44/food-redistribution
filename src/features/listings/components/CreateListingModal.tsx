"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { OutcomeBadge } from "@/components/shared/OutcomeBadge";
import { createListingAction } from "@/features/listings/actions/createListing";
import { Gift, Tag, Clock, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    foodType: "",
    quantity: 10,
    unit: "portions",
    condition: "Freshly baked / packaged today",
    outcome: "DONATE" as "DONATE" | "DISCOUNT",
    originalPrice: 15.0,
    discountPrice: 5.0,
    deadlineHours: 2,
  });

  const handleNext = () => {
    if (step === 1 && !formData.foodType) {
      alert("Please enter food type / description");
      return;
    }
    if (step < 3) setStep((step + 1) as 1 | 2 | 3);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as 1 | 2 | 3);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const deadlineDate = new Date();
      deadlineDate.setHours(deadlineDate.getHours() + Number(formData.deadlineHours));

      await createListingAction({
        foodType: formData.foodType,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        condition: formData.condition,
        collectionDeadline: deadlineDate.toISOString(),
        outcome: formData.outcome,
        originalPrice: formData.outcome === "DISCOUNT" ? Number(formData.originalPrice) : undefined,
        discountPrice: formData.outcome === "DISCOUNT" ? Number(formData.discountPrice) : undefined,
      });

      setStep(1);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to create surplus listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Surplus Food Listing" maxWidth="lg">
      {/* Progress Indicators */}
      <div className="flex items-center justify-between mb-6 border-b border-[#E3DBC9] pb-3">
        <div
          className={`flex items-center gap-2 text-xs font-medium ${
            step === 1 ? "text-[#B84A16]" : "text-[#6B6157]"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-[#EFEAE0] flex items-center justify-center text-[10px]">
            1
          </span>
          <span>1. Food Details</span>
        </div>
        <div className="w-8 h-[1px] bg-[#E3DBC9]" />
        <div
          className={`flex items-center gap-2 text-xs font-medium ${
            step === 2 ? "text-[#B84A16]" : "text-[#6B6157]"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-[#EFEAE0] flex items-center justify-center text-[10px]">
            2
          </span>
          <span>2. Outcome Choice</span>
        </div>
        <div className="w-8 h-[1px] bg-[#E3DBC9]" />
        <div
          className={`flex items-center gap-2 text-xs font-medium ${
            step === 3 ? "text-[#B84A16]" : "text-[#6B6157]"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-[#EFEAE0] flex items-center justify-center text-[10px]">
            3
          </span>
          <span>3. Pickup Deadline</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <Input
              label="Food Type / Description"
              placeholder="e.g. Artisan Sourdough Bread & Croissants"
              value={formData.foodType}
              onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Quantity"
                type="number"
                min={1}
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })
                }
              />

              <Select
                label="Unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                options={[
                  { value: "portions", label: "Portions / Meals" },
                  { value: "kg", label: "Kilograms (kg)" },
                  { value: "boxes", label: "Boxes / Crates" },
                  { value: "loaves", label: "Loaves / Items" },
                ]}
              />
            </div>

            <Input
              label="Food Condition / Storage Notes"
              placeholder="e.g. Freshly prepared, stored in temperature control"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <label className="text-xs font-semibold text-[#211D19]">
              Choose Listing Outcome Path
            </label>
            <p className="text-xs text-[#6B6157] -mt-2">
              Select whether this surplus batch is donated to verified NGOs or offered at a discount.
            </p>

            <div className="grid grid-cols-2 gap-4 my-2">
              {/* Donate Option */}
              <div
                onClick={() => setFormData({ ...formData, outcome: "DONATE" })}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.outcome === "DONATE"
                    ? "border-[#25423A] bg-[#25423A]/5 shadow-sm"
                    : "border-[#E3DBC9] hover:border-[#25423A]/50 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <OutcomeBadge outcome="DONATE" />
                  {formData.outcome === "DONATE" && (
                    <Check className="w-4 h-4 text-[#25423A]" />
                  )}
                </div>
                <h4 className="font-semibold text-sm text-[#211D19]">Donate Surplus</h4>
                <p className="text-xs text-[#6B6157] mt-1 leading-relaxed">
                  Matched to verified shelters & NGOs based on capacity and distance.
                </p>
              </div>

              {/* Discount Option */}
              <div
                onClick={() => setFormData({ ...formData, outcome: "DISCOUNT" })}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.outcome === "DISCOUNT"
                    ? "border-[#2E5E8C] bg-[#2E5E8C]/5 shadow-sm"
                    : "border-[#E3DBC9] hover:border-[#2E5E8C]/50 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <OutcomeBadge outcome="DISCOUNT" showPriceDetails={false} />
                  {formData.outcome === "DISCOUNT" && (
                    <Check className="w-4 h-4 text-[#2E5E8C]" />
                  )}
                </div>
                <h4 className="font-semibold text-sm text-[#211D19]">Discounted Sale</h4>
                <p className="text-xs text-[#6B6157] mt-1 leading-relaxed">
                  Offered to public buyers at a reduced rate to recover cost.
                </p>
              </div>
            </div>

            {formData.outcome === "DISCOUNT" && (
              <div className="p-4 rounded-xl bg-[#F5F1E8] border border-[#E3DBC9] grid grid-cols-2 gap-4">
                <Input
                  label="Original Retail Price ($)"
                  type="number"
                  step="0.5"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      originalPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <Input
                  label="Discounted Price ($)"
                  type="number"
                  step="0.5"
                  value={formData.discountPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <Select
              label="Collection Deadline Window"
              value={formData.deadlineHours}
              onChange={(e) =>
                setFormData({ ...formData, deadlineHours: parseInt(e.target.value) })
              }
              options={[
                { value: "1", label: "Must be collected within 1 hour (Closing soon)" },
                { value: "2", label: "Within 2 hours" },
                { value: "4", label: "Within 4 hours" },
                { value: "8", label: "Today by end of day" },
              ]}
              helperText="Past-deadline OPEN listings will be automatically flipped to EXPIRED via scheduled cron."
            />

            <div className="p-4 rounded-xl bg-white border border-[#E3DBC9] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#6B6157] block">Selected Outcome Path</span>
                <div className="mt-1">
                  <OutcomeBadge
                    outcome={formData.outcome}
                    originalPrice={formData.originalPrice}
                    discountPrice={formData.discountPrice}
                  />
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#6B6157] block">Surplus Quantity</span>
                <span className="text-sm font-semibold text-[#211D19]">
                  {formData.quantity} {formData.unit}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Actions */}
      <div className="flex items-center justify-between border-t border-[#E3DBC9] pt-4 mt-6">
        {step > 1 ? (
          <Button variant="secondary" onClick={handleBack} size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        ) : (
          <Button variant="ghost" onClick={onClose} size="sm">
            Cancel
          </Button>
        )}

        {step < 3 ? (
          <Button variant="primary" onClick={handleNext} size="sm">
            Next Step <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            variant={formData.outcome === "DONATE" ? "donate" : "discount"}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            size="md"
          >
            Publish Listing
          </Button>
        )}
      </div>
    </Modal>
  );
};
