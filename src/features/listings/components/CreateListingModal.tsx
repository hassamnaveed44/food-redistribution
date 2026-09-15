"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { OutcomeBadge } from "@/components/shared/OutcomeBadge";
import { createListingAction } from "@/features/listings/actions/createListing";
import { Gift, Tag, Clock, ArrowRight, ArrowLeft, Check, Sparkles, ShoppingBag, Utensils } from "lucide-react";
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
    foodType: "Bakery Surplus Magic Bag",
    quantity: 5,
    unit: "bags",
    condition: "Freshly baked today, safe sealed packaging",
    outcome: "DISCOUNT" as "DONATE" | "DISCOUNT",
    originalPrice: 18.5,
    discountPrice: 6.0,
    deadlineHours: 2,
  });

  const applyPreset = (preset: "BAKERY" | "MEAL" | "PRODUCE" | "DONATION") => {
    if (preset === "BAKERY") {
      setFormData({
        foodType: "Bakery Surplus Surprise Bag",
        quantity: 5,
        unit: "bags",
        condition: "Assorted sourdough bread, croissants & artisan pastries",
        outcome: "DISCOUNT",
        originalPrice: 18.5,
        discountPrice: 6.0,
        deadlineHours: 2,
      });
    } else if (preset === "MEAL") {
      setFormData({
        foodType: "Gourmet Prepared Meal Box",
        quantity: 4,
        unit: "boxes",
        condition: "Refrigerated prepared meals, grain bowls & wraps",
        outcome: "DISCOUNT",
        originalPrice: 24.0,
        discountPrice: 7.5,
        deadlineHours: 3,
      });
    } else if (preset === "PRODUCE") {
      setFormData({
        foodType: "Fresh Produce & Grocery Mystery Crate",
        quantity: 3,
        unit: "crates",
        condition: "Fresh seasonal fruits, vegetables & organic greens",
        outcome: "DISCOUNT",
        originalPrice: 15.0,
        discountPrice: 5.0,
        deadlineHours: 4,
      });
    } else if (preset === "DONATION") {
      setFormData({
        foodType: "Prepared Meals Donation Batch",
        quantity: 30,
        unit: "portions",
        condition: "Freshly prepared warm meals, ready for shelter distribution",
        outcome: "DONATE",
        originalPrice: 0,
        discountPrice: 0,
        deadlineHours: 2,
      });
    }
  };

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
    <Modal isOpen={isOpen} onClose={onClose} title="Release Surplus Food or Magic Bag" maxWidth="lg">
      {/* Quick Presets Banner */}
      <div className="mb-3 p-3 rounded-xl bg-[#FAF9F6] border border-slate-200">
        <span className="text-[11px] font-extrabold text-[#004F38] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5A5F]" /> Quick Magic Bag Presets
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => applyPreset("BAKERY")}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:border-[#FF5A5F] text-left transition-all shadow-xs"
          >
            <span className="text-xs font-bold text-[#004F38] block">🥐 Bakery Bag</span>
            <span className="text-[10px] text-[#FF5A5F] font-black">$18.50 → $6.00</span>
          </button>
          <button
            type="button"
            onClick={() => applyPreset("MEAL")}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:border-[#FF5A5F] text-left transition-all shadow-xs"
          >
            <span className="text-xs font-bold text-[#004F38] block">🍱 Meal Box</span>
            <span className="text-[10px] text-[#FF5A5F] font-black">$24.00 → $7.50</span>
          </button>
          <button
            type="button"
            onClick={() => applyPreset("PRODUCE")}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:border-[#FF5A5F] text-left transition-all shadow-xs"
          >
            <span className="text-xs font-bold text-[#004F38] block">🍏 Produce Crate</span>
            <span className="text-[10px] text-[#FF5A5F] font-black">$15.00 → $5.00</span>
          </button>
          <button
            type="button"
            onClick={() => applyPreset("DONATION")}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:border-[#00CC88] text-left transition-all shadow-xs"
          >
            <span className="text-xs font-bold text-[#004F38] block">🎁 Free NGO</span>
            <span className="text-[10px] text-[#00CC88] font-black">100% Free</span>
          </button>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
        <div
          className={`flex items-center gap-1.5 text-xs font-bold ${
            step === 1 ? "text-[#004F38]" : "text-slate-400"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-[#004F38] text-white flex items-center justify-center text-[11px]">
            1
          </span>
          <span>Food Details</span>
        </div>
        <div className="w-6 h-[2px] bg-slate-200" />
        <div
          className={`flex items-center gap-1.5 text-xs font-bold ${
            step === 2 ? "text-[#004F38]" : "text-slate-400"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-[#004F38] text-white flex items-center justify-center text-[11px]">
            2
          </span>
          <span>Outcome Choice</span>
        </div>
        <div className="w-6 h-[2px] bg-slate-200" />
        <div
          className={`flex items-center gap-1.5 text-xs font-bold ${
            step === 3 ? "text-[#004F38]" : "text-slate-400"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-[#004F38] text-white flex items-center justify-center text-[11px]">
            3
          </span>
          <span>Pickup Deadline</span>
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
            className="flex flex-col gap-3"
          >
            <Input
              label="Surplus Bag / Food Item Name"
              placeholder="e.g. Bakery Surplus Surprise Bag"
              value={formData.foodType}
              onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Quantity Available"
                type="number"
                min={1}
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })
                }
              />

              <Select
                label="Unit Type"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                options={[
                  { value: "bags", label: "Surprise Bags" },
                  { value: "portions", label: "Portions / Meals" },
                  { value: "kg", label: "Kilograms (kg)" },
                  { value: "boxes", label: "Boxes / Crates" },
                ]}
              />
            </div>

            <Input
              label="Condition / Allergen / Packaging Notes"
              placeholder="e.g. Freshly baked, stored in temperature control, contains gluten/dairy"
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
            className="flex flex-col gap-3"
          >
            <label className="text-[11px] font-bold text-[#004F38] uppercase tracking-wider">
              Choose Listing Outcome Path
            </label>

            <div className="grid grid-cols-2 gap-3 my-0.5">
              {/* Discount Option */}
              <div
                onClick={() => setFormData({ ...formData, outcome: "DISCOUNT" })}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.outcome === "DISCOUNT"
                    ? "border-[#FF5A5F] bg-red-50/50 shadow-md"
                    : "border-slate-200 hover:border-[#FF5A5F]/50 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <OutcomeBadge outcome="DISCOUNT" showPriceDetails={false} />
                  {formData.outcome === "DISCOUNT" && (
                    <Check className="w-4 h-4 text-[#FF5A5F]" />
                  )}
                </div>
                <h4 className="font-extrabold text-xs text-[#004F38]">Surprise Magic Bag (60-70% Off)</h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-tight font-medium">
                  Offered to local food rescuers at a steep discount to recover food value.
                </p>
              </div>

              {/* Donate Option */}
              <div
                onClick={() => setFormData({ ...formData, outcome: "DONATE" })}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.outcome === "DONATE"
                    ? "border-[#00CC88] bg-emerald-50/50 shadow-md"
                    : "border-slate-200 hover:border-[#00CC88]/50 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <OutcomeBadge outcome="DONATE" />
                  {formData.outcome === "DONATE" && (
                    <Check className="w-4 h-4 text-[#00CC88]" />
                  )}
                </div>
                <h4 className="font-extrabold text-xs text-[#004F38]">Free NGO Shelter Donation</h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-tight font-medium">
                  Matched 100% free to verified local shelters & food banks based on capacity.
                </p>
              </div>
            </div>

            {formData.outcome === "DISCOUNT" && (
              <div className="p-3 rounded-xl bg-[#FAF9F6] border border-slate-200 grid grid-cols-2 gap-3">
                <Input
                  label="Original Retail Value ($)"
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
                  label="Offer Price ($)"
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
            className="flex flex-col gap-3"
          >
            <Select
              label="Pickup Collection Window"
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
              helperText="Past-deadline OPEN listings automatically flip to EXPIRED via background cron."
            />

            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Selected Outcome</span>
                <div className="mt-0.5">
                  <OutcomeBadge
                    outcome={formData.outcome}
                    originalPrice={formData.originalPrice}
                    discountPrice={formData.discountPrice}
                  />
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500 font-medium block">Total Units Released</span>
                <span className="text-xs font-extrabold text-[#004F38]">
                  {formData.quantity} {formData.unit}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Actions */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-3 mt-4">
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
            Release Surplus Now
          </Button>
        )}
      </div>
    </Modal>
  );
};

