import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: string;
  variant?: "default" | "auth";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      icon,
      suffix,
      error,
      variant = "default",
      className = "",
      ...props
    },
    ref,
  ) => {
    const baseInputStyle =
      "w-full border text-white focus:outline-none transition-colors [color-scheme:dark]";

    const variants = {
      default:
        "bg-background rounded-lg py-2.5 text-sm placeholder-zinc-600 font-light",
      auth: "bg-[#3f3f42] border-zinc-500 rounded-xl py-2.5 text-base placeholder-zinc-500 focus:ring-1 focus:ring-brand",
    };

    const errorStyle = error
      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
      : variant === "default"
        ? "border-theme-border focus:border-brand"
        : "";

    const paddingX = icon ? "pl-10 pr-4" : "px-4";
    const paddingY = suffix ? "pr-11" : "";

    return (
      <div
        className={`w-full text-left ${variant === "auth" ? "flex flex-col gap-1.5" : "space-y-1"}`}
      >
        {label && (
          <label
            className={
              variant === "auth"
                ? "text-lg text-white font-bold block"
                : "text-xs text-zinc-400 font-medium block"
            }
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-lg flex items-center justify-center z-10 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`${baseInputStyle} ${variants[variant]} ${errorStyle} ${paddingX} ${paddingY} ${className}`}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">
              {suffix}
            </div>
          )}
        </div>
        {error && (
          <p
            className={
              variant === "auth"
                ? "text-[11px] text-red-400 mt-1"
                : "text-[11px] text-red-400 mt-1 pl-1 animate-fade-in"
            }
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
