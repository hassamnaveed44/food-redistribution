import React from "react";
import {
  Circle,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  CalendarCheck,
  Handshake,
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
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  size = "md",
}) => {
  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-xs gap-1" : "px-2.5 py-1 text-xs gap-1.5";

  switch (status) {
    case "OPEN":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-md bg-[#EFEAE0] text-[#211D19] border border-[#E3DBC9] ${sizeClasses}`}
        >
          <Circle className="w-3 h-3 text-[#6B6157]" />
          <span>OPEN</span>
        </span>
      );

    case "REQUESTED":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-md bg-[#FDF8EF] text-[#8A5B00] border border-[#F3E2C8] ${sizeClasses}`}
        >
          <Clock className="w-3 h-3 text-[#B8862B]" />
          <span>REQUESTED</span>
        </span>
      );

    case "MATCHED":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-md bg-[#FDF8EF] text-[#8A5B00] border border-[#F3E2C8] ${sizeClasses}`}
        >
          <Handshake className="w-3 h-3 text-[#B8862B]" />
          <span>MATCHED</span>
        </span>
      );

    case "SCHEDULED":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-md bg-[#FDF8EF] text-[#8A5B00] border border-[#F3E2C8] ${sizeClasses}`}
        >
          <CalendarCheck className="w-3 h-3 text-[#B8862B]" />
          <span>SCHEDULED</span>
        </span>
      );

    case "CONFIRMED":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-md bg-[#EBF5EE] text-[#1B4D2E] border border-[#C5E6D0] ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3 h-3 text-[#2E6B45]" />
          <span>CONFIRMED</span>
        </span>
      );

    case "EXPIRED":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-md bg-[#FDF2F0] text-[#8C2314] border border-[#F5C7C2] ${sizeClasses}`}
        >
          <AlertCircle className="w-3 h-3 text-[#B3402F]" />
          <span>EXPIRED</span>
        </span>
      );

    case "CANCELLED":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-md bg-[#FDF2F0] text-[#8C2314] border border-[#F5C7C2] ${sizeClasses}`}
        >
          <XCircle className="w-3 h-3 text-[#B3402F]" />
          <span>CANCELLED</span>
        </span>
      );

    default:
      return null;
  }
};
