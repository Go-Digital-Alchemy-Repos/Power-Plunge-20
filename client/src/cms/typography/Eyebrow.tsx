import { cn } from "@/lib/utils";
import type { ReactNode, CSSProperties } from "react";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export default function Eyebrow({
  children,
  className,
  align,
}: EyebrowProps) {
  const style: CSSProperties = {
    fontFamily: "var(--pp-font-family, 'Inter', sans-serif)",
    letterSpacing: "0.1em",
    color: "var(--pp-primary, #67e8f9)",
  };

  return (
    <span
      className={cn(
        "block text-xs font-semibold uppercase mb-3",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}
