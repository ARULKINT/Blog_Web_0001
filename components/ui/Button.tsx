"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  asChild?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 cursor-pointer select-none whitespace-nowrap",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        {
          primary:
            "bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.98] shadow-sm",
          secondary:
            "bg-surface-2 text-text hover:bg-border active:scale-[0.98]",
          ghost:
            "text-text hover:bg-surface-2 active:scale-[0.98]",
          outline:
            "border border-border text-text hover:bg-surface-2 active:scale-[0.98]",
        }[variant],
        {
          sm: "h-8 px-3 text-sm",
          md: "h-10 px-4 text-sm",
          lg: "h-12 px-6 text-base",
        }[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
