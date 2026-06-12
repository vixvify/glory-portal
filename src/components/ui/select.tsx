import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options = [], className = "", children, ...props }, ref) => {
    return (
      <div className="space-y-1 w-full text-left">
        {label && <label className="text-xs text-zinc-400 font-medium block">{label}</label>}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full bg-zinc-900 border rounded-lg py-2.5 px-4 pr-10 text-sm text-white focus:outline-none transition-colors font-light cursor-pointer appearance-none ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-zinc-800 focus:border-brand"
            } ${className}`}
            {...props}
          >
            {children ? children : options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-500 w-0 h-0" />
        </div>
        {error && (
          <p className="text-[11px] text-red-400 mt-1 pl-1 animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
