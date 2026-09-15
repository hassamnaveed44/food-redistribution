import React from "react";
import { Sparkles, Gift, Tag, ShoppingBag } from "lucide-react";

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
  unit = "bag",
  showPriceDetails = true,
}) => {
  if (outcome === "DONATE") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#004F38] text-white shadow-sm border border-[#00CC88]/30">
        <Gift className="w-3.5 h-3.5 text-[#00CC88]" />
        <span>100% FREE DONATION</span>
      </div>
    );
  }

  const orig = Number(originalPrice || 0);
  const disc = Number(discountPrice || 0);
  const discountPct = orig > 0 && disc < orig ? Math.round(((orig - disc) / orig) * 100) : 0;

  return (
    <div className="inline-flex items-center gap-2 flex-wrap">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FF5A5F] text-white shadow-sm">
        <ShoppingBag className="w-3.5 h-3.5 text-white" />
        <span>SURPRISE MAGIC BAG</span>
      </div>

      {discountPct > 0 && (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-[#FFC72C] text-[#0F172A] border border-amber-300">
          SAVE {discountPct}%
        </span>
      )}

      {showPriceDetails && disc > 0 && (
        <div className="inline-flex items-center gap-1.5 text-xs">
          {orig > 0 && (
            <span className="line-through text-[#94A3B8] font-medium">
              ${orig.toFixed(2)}
            </span>
          )}
          <span className="text-[#004F38] font-extrabold text-sm">
            ${disc.toFixed(2)}
            <span className="text-[10px] text-[#64748B] font-normal ml-0.5">
              /{unit}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

