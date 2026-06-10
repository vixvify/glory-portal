import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "brand" | "secondary" | "outline" | "ghost" | "white" | "glass";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "brand", size = "md", isLoading, children, className = "", ...props }, ref) => {
    const baseStyle =
      "inline-flex items-center justify-center font-bold rounded-md transition-all duration-300 active:scale-[0.98] select-none cursor-pointer focus:outline-none disabled:opacity-50 disabled:pointer-events-none tracking-wide";

    const variants = {
      brand: "bg-brand text-zinc-950 hover:bg-brand-hover shadow-lg hover:shadow-brand/25 border border-brand/25 transition-all duration-300",
      secondary: "bg-zinc-900/80 backdrop-blur-md hover:bg-zinc-800/90 text-zinc-100 border border-zinc-700/50 hover:border-brand/40 transition-all duration-300",
      outline: "border border-zinc-700/60 hover:border-brand/50 hover:bg-brand/5 text-zinc-300 hover:text-brand transition-all duration-300",
      ghost: "text-zinc-400 hover:text-brand bg-transparent hover:bg-zinc-800/30 transition-all duration-300",
      white: "bg-white text-zinc-950 hover:bg-zinc-100 shadow-md shadow-white/5 transition-all duration-300",
      glass: "glass-button",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-8 py-3.5 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
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
