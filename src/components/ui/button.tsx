import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "brand" | "secondary" | "outline" | "ghost" | "white" | "glass";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "brand", size = "md", isLoading, children, className = "", ...props }, ref) => {
    const baseStyle =
      "inline-flex items-center justify-center font-bold rounded-lg transition-all duration-200 active:scale-[0.98] select-none cursor-pointer focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      brand: "bg-brand text-white hover:bg-brand-hover shadow-md shadow-brand/10",
      secondary: "bg-zinc-800/60 backdrop-blur-md hover:bg-zinc-700/80 text-white border border-zinc-700/40",
      outline: "border border-zinc-700/30 hover:bg-zinc-850 text-zinc-300 hover:text-white backdrop-blur-sm",
      ghost: "text-zinc-400 hover:text-brand bg-transparent hover:bg-zinc-800/30",
      white: "bg-white text-black hover:bg-white/90 shadow-md shadow-white/5",
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
