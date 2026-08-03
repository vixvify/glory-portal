import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "brand" | "secondary" | "outline" | "ghost" | "white" | "glass" | "auth" | "auth-outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "brand", size = "md", isLoading, children, className = "", ...props }, ref) => {
    const baseStyle =
      "inline-flex items-center justify-center font-bold transition-all duration-300 active:scale-[0.98] select-none cursor-pointer focus:outline-none disabled:opacity-50 disabled:pointer-events-none tracking-wide";

    const variants = {
      brand: "bg-brand text-zinc-950 hover:bg-brand-hover shadow-sm border border-brand/25 transition-all duration-300",
      secondary: "bg-card-secondary hover:bg-card-hover text-zinc-100 border border-theme-border hover:border-brand/40 transition-all duration-300",
      outline: "border border-theme-border hover:border-brand/50 hover:bg-brand/5 text-zinc-300 hover:text-brand transition-all duration-300",
      ghost: "text-zinc-400 hover:text-brand bg-transparent hover:bg-zinc-800/30 transition-all duration-300",
      white: "bg-white text-zinc-950 hover:bg-zinc-100 shadow-md shadow-white/5 transition-all duration-300",
      glass: "glass-button",
      auth: "bg-gradient-to-r from-btn-from to-btn-to hover:opacity-90 text-white transition-opacity",
      "auth-outline": "border border-theme-border hover:border-brand/50 text-white transition-colors bg-transparent",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs rounded-md",
      md: "px-5 py-2.5 text-sm rounded-md",
      lg: "px-8 py-3.5 text-base rounded-md",
      auth: "w-full py-2.5 text-lg rounded-xl font-bold",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyle} ${variants[variant]} ${variant.startsWith("auth") ? sizes["auth"] : sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
