import type { ThemeTokens } from "./themeTokens.types";

export const defaultThemeTokens: ThemeTokens = {
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
  typography: {
    fontFamilyBase: "'Inter', sans-serif",
    fontSizeScale: 1,
    lineHeightBase: 1.5,
    letterSpacingBase: "0em",
  },
  radius: {
    radiusSm: "0.25rem",
    radiusMd: "0.5rem",
    radiusLg: "0.75rem",
    radiusXl: "1rem",
  },
  shadows: {
    shadowSm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    shadowMd: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    shadowLg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
  spacing: {
    spaceBase: 4,
    spaceScale: [1, 2, 3, 4, 6, 8],
  },
  buttons: {
    buttonRadius: "md",
    buttonStyle: "solid",
    buttonPaddingY: "0.5rem",
    buttonPaddingX: "1rem",
  },
  layout: {
    containerMaxWidth: 1280,
    sectionPaddingY: "3rem",
    sectionPaddingX: "1rem",
  },
};
