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
            className="text-xs font-medium text-[#211D19]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={twMerge(
            clsx(
              "px-3 py-2 text-sm rounded-lg bg-white border border-[#E3DBC9] text-[#211D19] placeholder:text-[#6B6157]/60 focus:outline-none focus:ring-2 focus:ring-[#B84A16] focus:border-transparent transition-colors disabled:bg-[#EFEAE0] disabled:cursor-not-allowed min-h-[44px]",
              error && "border-[#B3402F] focus:ring-[#B3402F]",
              className
            )
          )}
          {...props}
        />
        {error ? (
          <span className="text-xs text-[#B3402F] font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-[#6B6157]">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
