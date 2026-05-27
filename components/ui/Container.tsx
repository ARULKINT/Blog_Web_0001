import { cn } from "@/lib/utils";
import type { ElementType, ReactNode, ComponentPropsWithoutRef } from "react";

type ContainerProps<T extends ElementType = "div"> = {
  children: ReactNode;
  className?: string;
  as?: T;
  narrow?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "children" | "className">;

export function Container<T extends ElementType = "div">({
  children,
  className,
  as,
  narrow = false,
  ...rest
}: ContainerProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        narrow ? "max-w-3xl" : "max-w-7xl",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
