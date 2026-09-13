import React from "react";
import { Gift, Tag } from "lucide-react";

export interface OutcomeBadgeProps {
  outcome: "DONATE" | "DISCOUNT";
  originalPrice?: number | string | null;
  discountPrice?: number | string | null;
  unit?: string;
  showPriceDetails?: boolean;
}

export const OutcomeBadge: React.FC<OutcomeBadgeProps> = ({
  outcome,
  originalPrice,
  discountPrice,
  unit = "batch",
  showPriceDetails = true,
}) => {
  if (outcome === "DONATE") {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#25423A] text-white">
        <Gift className="w-3.5 h-3.5" />
        <span>Donate</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#2E5E8C] text-white">
        <Tag className="w-3.5 h-3.5" />
        <span>Discount</span>
      </div>

      {showPriceDetails && discountPrice !== undefined && discountPrice !== null && (
        <div className="inline-flex items-center gap-1.5 text-xs font-medium">
          {originalPrice && (
            <span className="line-through text-[#6B6157]">
              ${Number(originalPrice).toFixed(2)}
            </span>
          )}
          <span className="text-[#211D19] font-semibold">
            ${Number(discountPrice).toFixed(2)}
            <span className="text-[10px] text-[#6B6157] font-normal ml-0.5">
              /{unit}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};
