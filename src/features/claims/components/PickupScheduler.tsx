"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { schedulePickupAction } from "@/features/claims/actions/schedulePickup";
import { Calendar, Clock, CheckCircle } from "lucide-react";

export interface PickupSchedulerProps {
  listingId: string;
  onScheduled?: () => void;
}

export const PickupScheduler: React.FC<PickupSchedulerProps> = ({
  listingId,
  onScheduled,
}) => {
  const [startTime, setStartTime] = useState("17:00");
  const [endTime, setEndTime] = useState("18:30");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const today = new Date().toISOString().split("T")[0];
      const startIso = new Date(`${today}T${startTime}:00`).toISOString();
      const endIso = new Date(`${today}T${endTime}:00`).toISOString();

      await schedulePickupAction(listingId, startIso, endIso);
      alert("Pickup window scheduled!");
      if (onScheduled) onScheduled();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to schedule pickup window");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-xl border border-[#E3DBC9] bg-[#F5F1E8]/50 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#211D19]">
        <Calendar className="w-4 h-4 text-[#B84A16]" />
        <span>Schedule Handover Pickup Window</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Window Start Time"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <Input
          label="Window End Time"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </div>

      <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
        <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Save Pickup Window
      </Button>
    </form>
  );
};
