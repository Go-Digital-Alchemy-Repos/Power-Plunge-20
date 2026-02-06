import { cn } from "@/lib/utils";
import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes, CSSProperties } from "react";

type CmsButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type CmsButtonSize = "default" | "lg";

interface CmsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CmsButtonVariant;
  size?: CmsButtonSize;
  href?: string;
  children: ReactNode;
}

const hoverFocus = "hover:brightness-110 active:brightness-90 focus-visible:ring-2 focus-visible:ring-offset-2";

const variantStyles: Record<CmsButtonVariant, { base: string; css: CSSProperties }> = {
  primary: {
    base: `font-semibold shadow-lg ${hoverFocus}`,
    css: {
      backgroundColor: "var(--pp-primary, #67e8f9)",
      color: "var(--pp-primary-text, #030712)",
      boxShadow: "0 0 20px color-mix(in srgb, var(--pp-primary, #67e8f9) 30%, transparent)",
    },
  },
  secondary: {
    base: `font-semibold ${hoverFocus}`,
    css: {
      backgroundColor: "var(--pp-secondary, #06b6d4)",
      color: "var(--pp-secondary-text, #f9fafb)",
    },
  },
  outline: {
    base: `font-semibold border-2 bg-transparent ${hoverFocus}`,
    css: {
      borderColor: "var(--pp-primary, #67e8f9)",
      color: "var(--pp-primary, #67e8f9)",
    },
  },
  ghost: {
    base: `font-medium bg-transparent ${hoverFocus}`,
    css: {
      color: "var(--pp-primary, #67e8f9)",
    },
  },
};

const sizeStyles: Record<CmsButtonSize, string> = {
  default: "text-sm",
  lg: "text-lg",
};

export default function CmsButton({
  variant = "primary",
  size = "default",
  href,
  children,
  className,
  style,
  ...rest
}: CmsButtonProps) {
  const v = variantStyles[variant];

  const mergedStyle: CSSProperties = {
    borderRadius: "var(--pp-btn-radius, 0.5rem)",
    paddingTop: size === "lg" ? "calc(var(--pp-btn-py, 0.5rem) * 1.5)" : "var(--pp-btn-py, 0.5rem)",
    paddingBottom: size === "lg" ? "calc(var(--pp-btn-py, 0.5rem) * 1.5)" : "var(--pp-btn-py, 0.5rem)",
    paddingLeft: size === "lg" ? "calc(var(--pp-btn-px, 1rem) * 2)" : "var(--pp-btn-px, 1rem)",
    paddingRight: size === "lg" ? "calc(var(--pp-btn-px, 1rem) * 2)" : "var(--pp-btn-px, 1rem)",
    fontFamily: "var(--pp-font-family, 'Inter', sans-serif)",
    transition: "filter 150ms ease, box-shadow 150ms ease, background-color 150ms ease",
    ...v.css,
    ...style,
  };

  const classes = cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    v.base,
    sizeStyles[size],
    className
  );

  if (href) {
    const { onClick: _onClick, type: _type, disabled: _disabled, ...anchorSafe } = rest;
    return (
      <a href={href} className={classes} style={mergedStyle} {...anchorSafe as AnchorHTMLAttributes<HTMLAnchorElement>}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} style={mergedStyle} {...rest}>
      {children}
    </button>
  );
}
