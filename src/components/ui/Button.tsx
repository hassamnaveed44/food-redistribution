import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "donate" | "discount" | "sunshine";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00CC88] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

    const variantStyles = {
      primary:
        "bg-[#004F38] hover:bg-[#003828] text-white shadow-md hover:shadow-lg shadow-[#004F38]/20",
      secondary:
        "bg-white hover:bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] shadow-sm",
      ghost: "hover:bg-[#F1F5F9] text-[#0F172A]",
      danger: "bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-md shadow-red-500/20",
      donate:
        "bg-[#00CC88] hover:bg-[#059669] text-white font-bold shadow-md hover:shadow-lg shadow-[#00CC88]/30",
      discount:
        "bg-[#FF5A5F] hover:bg-[#E11D48] text-white font-bold shadow-md hover:shadow-lg shadow-[#FF5A5F]/30",
      sunshine:
        "bg-[#FFC72C] hover:bg-[#F59E0B] text-[#0F172A] font-bold shadow-md hover:shadow-lg shadow-amber-400/30",
    };

    const sizeStyles = {
      sm: "px-3.5 py-1.5 text-xs min-h-[36px]",
      md: "px-5 py-2.5 text-sm min-h-[44px]",
      lg: "px-7 py-3.5 text-base min-h-[50px] text-base",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
