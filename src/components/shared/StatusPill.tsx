import React from "react";
import {
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  CalendarCheck,
  Handshake,
  ShoppingBag,
} from "lucide-react";

export type ListingStatus =
  | "OPEN"
  | "REQUESTED"
  | "MATCHED"
  | "SCHEDULED"
  | "CONFIRMED"
  | "EXPIRED"
  | "CANCELLED";

export interface StatusPillProps {
  status: ListingStatus;
  size?: "sm" | "md";
  quantityLeft?: number;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  size = "md",
  quantityLeft,
}) => {
  const sizeClasses =
    size === "sm" ? "px-2.5 py-0.5 text-[11px] gap-1" : "px-3 py-1 text-xs gap-1.5";

  switch (status) {
    case "OPEN":
      if (quantityLeft && quantityLeft <= 3) {
        return (
          <span
            className={`inline-flex items-center font-extrabold rounded-full bg-[#FF5A5F] text-white shadow-sm ${sizeClasses}`}
          >
            <ShoppingBag className="w-3 h-3 text-white" />
            <span>ONLY {quantityLeft} LEFT</span>
          </span>
        );
      }
      return (
        <span
          className={`inline-flex items-center font-extrabold rounded-full bg-emerald-100 text-[#004F38] border border-emerald-300 shadow-xs ${sizeClasses}`}
        >
          <Clock className="w-3 h-3 text-[#004F38]" />
          <span>AVAILABLE TODAY</span>
        </span>
      );

    case "REQUESTED":
      return (
        <span
          className={`inline-flex items-center font-extrabold rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-xs ${sizeClasses}`}
        >
          <Clock className="w-3 h-3 text-amber-700" />
          <span>WAITING APPROVAL</span>
        </span>
      );

    case "MATCHED":
      return (
        <span
          className={`inline-flex items-center font-bold rounded-full bg-[#FFC72C]/20 text-[#8A5B00] border border-amber-300 ${sizeClasses}`}
        >
          <Handshake className="w-3 h-3 text-[#F59E0B]" />
          <span>MATCHED</span>
        </span>
      );

    case "SCHEDULED":
      return (
        <span
          className={`inline-flex items-center font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}
        >
          <CalendarCheck className="w-3 h-3 text-blue-600" />
          <span>SCHEDULED</span>
        </span>
      );

    case "CONFIRMED":
      return (
        <span
          className={`inline-flex items-center font-bold rounded-full bg-[#004F38] text-white ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3 h-3 text-[#00CC88]" />
          <span>RESCUED & COLLECTED</span>
        </span>
      );

    case "EXPIRED":
      return (
        <span
          className={`inline-flex items-center font-bold rounded-full bg-slate-100 text-slate-500 border border-slate-200 ${sizeClasses}`}
        >
          <AlertCircle className="w-3 h-3 text-slate-400" />
          <span>SOLD OUT / EXPIRED</span>
        </span>
      );

    case "CANCELLED":
      return (
        <span
          className={`inline-flex items-center font-bold rounded-full bg-rose-50 text-rose-600 border border-rose-200 ${sizeClasses}`}
        >
          <XCircle className="w-3 h-3 text-rose-500" />
          <span>CANCELLED</span>
        </span>
      );

    default:
      return null;
  }
};

