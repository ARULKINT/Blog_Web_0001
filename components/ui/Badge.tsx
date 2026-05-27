import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  color?: string;
  variant?: "default" | "outline" | "solid";
}

export function Badge({
  children,
  className,
  color,
  variant = "default",
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full text-xs font-medium px-2.5 py-0.5",
        variant === "default" && "bg-surface-2 text-muted",
        variant === "outline" && "border border-border text-muted",
        variant === "solid" && "text-white",
        className
      )}
      style={variant === "solid" && color ? { backgroundColor: color } : undefined}
    >
      {children}
    </span>
  );
}
