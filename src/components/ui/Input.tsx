import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-[#0F172A]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={twMerge(
            clsx(
              "px-3.5 py-2.5 text-sm rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#00CC88] focus:border-[#00CC88] transition-all disabled:bg-[#F1F5F9] disabled:cursor-not-allowed min-h-[44px]",
              error && "border-[#EF4444] focus:ring-[#EF4444]",
              className
            )
          )}
          {...props}
        />
        {error ? (
          <span className="text-xs text-[#EF4444] font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-[#64748B]">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
