import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, suffix, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1 w-full text-left">
        {label && <label className="text-xs text-zinc-400 font-medium block">{label}</label>}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-lg flex items-center justify-center z-10 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-[#0D0D0D] border rounded-lg py-2.5 text-sm text-white focus:outline-none transition-colors placeholder-zinc-600 font-light [color-scheme:dark] ${
              icon ? "pl-10" : "pl-4"
            } ${
              suffix ? "pr-10" : "pr-4"
            } ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-[#3A3A3A] focus:border-brand"
            } ${className}`}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">
              {suffix}
            </div>
          )}
        </div>
        {error && (
          <p className="text-[11px] text-red-400 mt-1 pl-1 animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
