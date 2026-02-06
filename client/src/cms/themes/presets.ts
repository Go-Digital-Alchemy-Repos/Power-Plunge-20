import type { ThemeTokenPreset, ThemeTokens } from "./themeTokens.types";
import { defaultThemeTokens } from "./themeTokens.defaults";

function preset(
  id: string,
  name: string,
  description: string,
  overrides: Partial<ThemeTokens> & { colors: ThemeTokens["colors"] }
): ThemeTokenPreset {
  return {
    id,
    name,
    description,
    tokens: {
      ...defaultThemeTokens,
      ...overrides,
      colors: overrides.colors,
      typography: { ...defaultThemeTokens.typography, ...overrides.typography },
      radius: { ...defaultThemeTokens.radius, ...overrides.radius },
      shadows: { ...defaultThemeTokens.shadows, ...overrides.shadows },
      spacing: { ...defaultThemeTokens.spacing, ...overrides.spacing },
      buttons: { ...defaultThemeTokens.buttons, ...overrides.buttons },
      layout: { ...defaultThemeTokens.layout, ...overrides.layout },
    },
  };
}

export const themeTokenPresets: ThemeTokenPreset[] = [
  preset("ocean-blue", "Ocean Blue", "Primary blue with deep ocean tones — the signature Power Plunge look", {
    colors: {
      colorBg: "#030712",
      colorSurface: "#111827",
      colorSurfaceAlt: "#1f2937",
      colorText: "#f9fafb",
      colorTextMuted: "#9ca3af",
      colorBorder: "#374151",
      colorPrimary: "#67e8f9",
      colorPrimaryText: "#030712",
      colorSecondary: "#06b6d4",
      colorSecondaryText: "#f9fafb",
      colorAccent: "#22d3ee",
      colorAccentText: "#030712",
      colorSuccess: "#34d399",
      colorWarning: "#fbbf24",
      colorDanger: "#f87171",
    },
  }),

  preset("midnight", "Midnight", "Ultra-dark mode with soft blue accents for low-light environments", {
    colors: {
      colorBg: "#0a0e1a",
      colorSurface: "#111936",
      colorSurfaceAlt: "#1a2347",
      colorText: "#e8ecf4",
      colorTextMuted: "#8892b0",
      colorBorder: "#1e3a5f",
      colorPrimary: "#60a5fa",
      colorPrimaryText: "#0a0e1a",
      colorSecondary: "#3b82f6",
      colorSecondaryText: "#ffffff",
      colorAccent: "#93c5fd",
      colorAccentText: "#0a0e1a",
      colorSuccess: "#4ade80",
      colorWarning: "#facc15",
      colorDanger: "#fb7185",
    },
    radius: { radiusSm: "0.25rem", radiusMd: "0.5rem", radiusLg: "0.75rem", radiusXl: "1rem" },
  }),

  preset("minimal-light", "Minimal Light", "Clean white and pale gray surfaces with dark text for a light-mode feel", {
    colors: {
      colorBg: "#ffffff",
      colorSurface: "#f8fafc",
      colorSurfaceAlt: "#f1f5f9",
      colorText: "#0f172a",
      colorTextMuted: "#64748b",
      colorBorder: "#e2e8f0",
      colorPrimary: "#0891b2",
      colorPrimaryText: "#ffffff",
      colorSecondary: "#475569",
      colorSecondaryText: "#ffffff",
      colorAccent: "#06b6d4",
      colorAccentText: "#ffffff",
      colorSuccess: "#16a34a",
      colorWarning: "#d97706",
      colorDanger: "#dc2626",
    },
    shadows: {
      shadowSm: "0 1px 2px 0 rgb(0 0 0 / 0.03)",
      shadowMd: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
      shadowLg: "0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)",
    },
  }),

  preset("contrast-pro", "Contrast Pro", "High-contrast dark mode with bright white text and vivid accents for maximum readability", {
    colors: {
      colorBg: "#000000",
      colorSurface: "#18181b",
      colorSurfaceAlt: "#27272a",
      colorText: "#ffffff",
      colorTextMuted: "#a1a1aa",
      colorBorder: "#3f3f46",
      colorPrimary: "#38bdf8",
      colorPrimaryText: "#000000",
      colorSecondary: "#e4e4e7",
      colorSecondaryText: "#000000",
      colorAccent: "#facc15",
      colorAccentText: "#000000",
      colorSuccess: "#22c55e",
      colorWarning: "#f59e0b",
      colorDanger: "#ef4444",
    },
    buttons: { buttonRadius: "sm", buttonStyle: "solid", buttonPaddingY: "0.625rem", buttonPaddingX: "1.25rem" },
  }),

  preset("warm-neutral", "Warm Neutral", "Earthy warm tones with cream and terracotta hints", {
    colors: {
      colorBg: "#1c1917",
      colorSurface: "#292524",
      colorSurfaceAlt: "#44403c",
      colorText: "#fafaf9",
      colorTextMuted: "#a8a29e",
      colorBorder: "#57534e",
      colorPrimary: "#fb923c",
      colorPrimaryText: "#1c1917",
      colorSecondary: "#d6d3d1",
      colorSecondaryText: "#1c1917",
      colorAccent: "#f97316",
      colorAccentText: "#ffffff",
      colorSuccess: "#86efac",
      colorWarning: "#fde047",
      colorDanger: "#fca5a5",
    },
    radius: { radiusSm: "0.375rem", radiusMd: "0.625rem", radiusLg: "0.875rem", radiusXl: "1.25rem" },
  }),

  preset("slate-and-blue", "Slate & Blue", "Cool blue-gray slate palette with steel blue accents", {
    colors: {
      colorBg: "#0f172a",
      colorSurface: "#1e293b",
      colorSurfaceAlt: "#334155",
      colorText: "#f1f5f9",
      colorTextMuted: "#94a3b8",
      colorBorder: "#475569",
      colorPrimary: "#3b82f6",
      colorPrimaryText: "#ffffff",
      colorSecondary: "#64748b",
      colorSecondaryText: "#ffffff",
      colorAccent: "#6366f1",
      colorAccentText: "#ffffff",
      colorSuccess: "#4ade80",
      colorWarning: "#fbbf24",
      colorDanger: "#f87171",
    },
  }),

  preset("frost", "Frost", "Icy crystalline tones with pale blue highlights — crisp and clean", {
    colors: {
      colorBg: "#090b10",
      colorSurface: "#12151c",
      colorSurfaceAlt: "#1c2028",
      colorText: "#f0f4f8",
      colorTextMuted: "#8c95a4",
      colorBorder: "#2a3040",
      colorPrimary: "#e2e8f0",
      colorPrimaryText: "#090b10",
      colorSecondary: "#94a3b8",
      colorSecondaryText: "#090b10",
      colorAccent: "#a5f3fc",
      colorAccentText: "#090b10",
      colorSuccess: "#6ee7b7",
      colorWarning: "#fde047",
      colorDanger: "#fda4af",
    },
  }),

  preset("charcoal-gold", "Charcoal Gold Accent", "Deep charcoal base with premium gold accent details", {
    colors: {
      colorBg: "#0a0904",
      colorSurface: "#161408",
      colorSurfaceAlt: "#221f0e",
      colorText: "#fefce8",
      colorTextMuted: "#bba654",
      colorBorder: "#3d370f",
      colorPrimary: "#eab308",
      colorPrimaryText: "#0a0904",
      colorSecondary: "#ca8a04",
      colorSecondaryText: "#fefce8",
      colorAccent: "#fbbf24",
      colorAccentText: "#0a0904",
      colorSuccess: "#86efac",
      colorWarning: "#fde68a",
      colorDanger: "#fca5a5",
    },
    radius: { radiusSm: "0.125rem", radiusMd: "0.25rem", radiusLg: "0.5rem", radiusXl: "0.75rem" },
  }),

  preset("clean-clinical", "Clean Clinical", "Spa-like serene aesthetic with soft whites, mints, and gentle tones", {
    colors: {
      colorBg: "#f0fdfa",
      colorSurface: "#ffffff",
      colorSurfaceAlt: "#f0fdf4",
      colorText: "#134e4a",
      colorTextMuted: "#5eead4",
      colorBorder: "#ccfbf1",
      colorPrimary: "#14b8a6",
      colorPrimaryText: "#ffffff",
      colorSecondary: "#5eead4",
      colorSecondaryText: "#134e4a",
      colorAccent: "#2dd4bf",
      colorAccentText: "#042f2e",
      colorSuccess: "#10b981",
      colorWarning: "#f59e0b",
      colorDanger: "#ef4444",
    },
    shadows: {
      shadowSm: "0 1px 2px 0 rgb(0 0 0 / 0.02)",
      shadowMd: "0 4px 6px -1px rgb(0 0 0 / 0.04), 0 2px 4px -2px rgb(0 0 0 / 0.04)",
      shadowLg: "0 10px 15px -3px rgb(0 0 0 / 0.04), 0 4px 6px -4px rgb(0 0 0 / 0.04)",
    },
    radius: { radiusSm: "0.5rem", radiusMd: "0.75rem", radiusLg: "1rem", radiusXl: "1.5rem" },
  }),

  preset("energetic-blue-pop", "Energetic Blue Pop", "Vibrant electric blue and punchy accents for high-energy branding", {
    colors: {
      colorBg: "#020617",
      colorSurface: "#0f172a",
      colorSurfaceAlt: "#1e293b",
      colorText: "#f8fafc",
      colorTextMuted: "#94a3b8",
      colorBorder: "#334155",
      colorPrimary: "#2563eb",
      colorPrimaryText: "#ffffff",
      colorSecondary: "#7c3aed",
      colorSecondaryText: "#ffffff",
      colorAccent: "#06b6d4",
      colorAccentText: "#ffffff",
      colorSuccess: "#22c55e",
      colorWarning: "#eab308",
      colorDanger: "#ef4444",
    },
    buttons: { buttonRadius: "lg", buttonStyle: "solid", buttonPaddingY: "0.625rem", buttonPaddingX: "1.5rem" },
  }),
];

export function getPresetById(id: string): ThemeTokenPreset | undefined {
  return themeTokenPresets.find((p) => p.id === id);
}

export const defaultPresetId = "ocean-blue";
