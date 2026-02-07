import type { ComponentVariantSelection } from "./componentVariants";
import type { BlockStyleDefaultsMap } from "./blockStyleDefaults";

export interface ThemePackPreset {
  id: string;
  name: string;
  description: string;
  themeTokens: Record<string, string>;
  componentVariants: ComponentVariantSelection;
  blockStyleDefaults: BlockStyleDefaultsMap;
}

export const themePackPresets: ThemePackPreset[] = [
  {
    id: "performance-tech",
    name: "Performance Tech",
    description: "Bold, high-contrast look inspired by athletic performance gear and tech dashboards",
    themeTokens: {
      "--theme-bg": "#05080f",
      "--theme-bg-card": "#0d1320",
      "--theme-bg-elevated": "#151d30",
      "--theme-text": "#f0f4ff",
      "--theme-text-muted": "#7b8ba8",
      "--theme-primary": "#38bdf8",
      "--theme-primary-hover": "#0ea5e9",
      "--theme-primary-muted": "rgba(56,189,248,0.12)",
      "--theme-accent": "#0284c7",
      "--theme-border": "#1e3050",
      "--theme-success": "#22d3ee",
      "--theme-error": "#f43f5e",
      "--theme-warning": "#f59e0b",
      "--theme-radius": "0.375rem",
      "--theme-font": "'Inter', sans-serif",
    },
    componentVariants: {
      button: "square",
      card: "elevated",
      hero: "full-bleed",
      section: "spacious",
      divider: "bold",
      productCard: "standard",
    },
    blockStyleDefaults: {
      hero: {
        defaultAlign: "left",
        defaultOverlay: "70",
        defaultHeight: "tall",
        defaultLayout: "split-left",
        fullWidth: true,
      },
      featureList: {
        cardStyle: "elevated",
        iconPosition: "left",
        columns: 3,
      },
      callToAction: {
        centeredLayout: false,
        showSecondaryButton: true,
        backgroundStyle: "solid",
      },
      testimonials: {
        layout: "cards",
        showAvatar: true,
        cardStyle: "elevated",
      },
      productGrid: {
        columns: 3,
        showPrice: true,
        cardStyle: "standard",
      },
      trustBar: {
        layout: "row",
        iconSize: "lg",
      },
      benefitStack: {
        layout: "timeline",
        showIcons: true,
      },
      comparisonTable: {
        striped: true,
        highlightWinner: true,
      },
      divider: {
        style: "bold",
      },
    },
  },
  {
    id: "spa-minimal",
    name: "Spa Minimal",
    description: "Serene, airy aesthetic with soft pastels and generous whitespace for wellness brands",
    themeTokens: {
      "--theme-bg": "#0f1210",
      "--theme-bg-card": "#171e1a",
      "--theme-bg-elevated": "#1f2824",
      "--theme-text": "#e8f0ec",
      "--theme-text-muted": "#8faa9c",
      "--theme-primary": "#86efac",
      "--theme-primary-hover": "#4ade80",
      "--theme-primary-muted": "rgba(134,239,172,0.10)",
      "--theme-accent": "#22c55e",
      "--theme-border": "#2a3d32",
      "--theme-success": "#6ee7b7",
      "--theme-error": "#fda4af",
      "--theme-warning": "#fde68a",
      "--theme-radius": "1rem",
      "--theme-font": "'Inter', sans-serif",
    },
    componentVariants: {
      button: "pill",
      card: "flat",
      hero: "contained",
      section: "spacious",
      divider: "centered",
      productCard: "minimal",
    },
    blockStyleDefaults: {
      hero: {
        defaultAlign: "center",
        defaultOverlay: "40",
        defaultHeight: "default",
        defaultLayout: "stacked",
        fullWidth: false,
      },
      featureList: {
        cardStyle: "flat",
        iconPosition: "top",
        columns: 3,
      },
      callToAction: {
        centeredLayout: true,
        showSecondaryButton: false,
        backgroundStyle: "gradient",
      },
      testimonials: {
        layout: "slider",
        showAvatar: true,
        cardStyle: "flat",
      },
      productGrid: {
        columns: 2,
        showPrice: true,
        cardStyle: "minimal",
      },
      trustBar: {
        layout: "wrap",
        iconSize: "md",
      },
      benefitStack: {
        layout: "stack",
        showIcons: true,
      },
      faq: {
        allowMultipleOpen: true,
        iconStyle: "chevron",
      },
      divider: {
        style: "centered",
      },
    },
  },
  {
    id: "clinical-clean",
    name: "Clinical Clean",
    description: "Crisp, authoritative design inspired by medical and scientific aesthetics",
    themeTokens: {
      "--theme-bg": "#090c12",
      "--theme-bg-card": "#10141c",
      "--theme-bg-elevated": "#181d28",
      "--theme-text": "#edf0f5",
      "--theme-text-muted": "#8892a6",
      "--theme-primary": "#94a3b8",
      "--theme-primary-hover": "#cbd5e1",
      "--theme-primary-muted": "rgba(148,163,184,0.12)",
      "--theme-accent": "#64748b",
      "--theme-border": "#2a303c",
      "--theme-success": "#4ade80",
      "--theme-error": "#ef4444",
      "--theme-warning": "#f59e0b",
      "--theme-radius": "0.25rem",
      "--theme-font": "'Inter', sans-serif",
    },
    componentVariants: {
      button: "rounded",
      card: "outlined",
      hero: "contained",
      section: "divided",
      divider: "subtle",
      productCard: "bordered",
    },
    blockStyleDefaults: {
      hero: {
        defaultAlign: "left",
        defaultOverlay: "50",
        defaultHeight: "default",
        defaultLayout: "split-left",
        fullWidth: false,
      },
      featureList: {
        cardStyle: "outlined",
        iconPosition: "left",
        columns: 2,
      },
      callToAction: {
        centeredLayout: true,
        showSecondaryButton: true,
        backgroundStyle: "solid",
      },
      testimonials: {
        layout: "cards",
        showAvatar: false,
        cardStyle: "outlined",
      },
      productGrid: {
        columns: 3,
        showPrice: true,
        cardStyle: "bordered",
      },
      trustBar: {
        layout: "row",
        iconSize: "sm",
      },
      scienceExplainer: {
        showCitations: true,
        showDisclaimer: true,
      },
      safetyChecklist: {
        showDisclaimer: true,
        groupByRequired: true,
      },
      comparisonTable: {
        striped: false,
        highlightWinner: true,
      },
      divider: {
        style: "subtle",
      },
    },
  },
  {
    id: "luxury-wellness",
    name: "Luxury Wellness",
    description: "Premium gold-accented design with rich warm tones for high-end wellness products",
    themeTokens: {
      "--theme-bg": "#0a0906",
      "--theme-bg-card": "#15130c",
      "--theme-bg-elevated": "#201d12",
      "--theme-text": "#faf6ee",
      "--theme-text-muted": "#b8a87a",
      "--theme-primary": "#d4a53c",
      "--theme-primary-hover": "#eab308",
      "--theme-primary-muted": "rgba(212,165,60,0.12)",
      "--theme-accent": "#a07c1c",
      "--theme-border": "#3a3420",
      "--theme-success": "#86efac",
      "--theme-error": "#fca5a5",
      "--theme-warning": "#fde68a",
      "--theme-radius": "0.5rem",
      "--theme-font": "'Inter', sans-serif",
    },
    componentVariants: {
      button: "soft",
      card: "elevated",
      hero: "full-bleed",
      section: "spacious",
      divider: "centered",
      productCard: "standard",
    },
    blockStyleDefaults: {
      hero: {
        defaultAlign: "center",
        defaultOverlay: "65",
        defaultHeight: "tall",
        defaultLayout: "stacked",
        fullWidth: true,
      },
      featureList: {
        cardStyle: "elevated",
        iconPosition: "top",
        columns: 3,
      },
      callToAction: {
        centeredLayout: true,
        showSecondaryButton: true,
        backgroundStyle: "gradient",
      },
      testimonials: {
        layout: "slider",
        showAvatar: true,
        cardStyle: "elevated",
      },
      productGrid: {
        columns: 2,
        showPrice: true,
        cardStyle: "standard",
      },
      trustBar: {
        layout: "row",
        iconSize: "md",
      },
      guaranteeAndWarranty: {
        layout: "cards",
        showIcons: true,
      },
      financingAndPayment: {
        showCalculator: true,
        highlightPrimary: true,
      },
      divider: {
        style: "centered",
      },
    },
  },
  {
    id: "dark-performance",
    name: "Dark Performance",
    description: "Intense, high-energy dark theme with vivid cyan accents for maximum impact",
    themeTokens: {
      "--theme-bg": "#020408",
      "--theme-bg-card": "#080e18",
      "--theme-bg-elevated": "#0e1726",
      "--theme-text": "#f4f8ff",
      "--theme-text-muted": "#6b7fa0",
      "--theme-primary": "#06b6d4",
      "--theme-primary-hover": "#22d3ee",
      "--theme-primary-muted": "rgba(6,182,212,0.15)",
      "--theme-accent": "#0891b2",
      "--theme-border": "#162030",
      "--theme-success": "#34d399",
      "--theme-error": "#fb7185",
      "--theme-warning": "#fbbf24",
      "--theme-radius": "0.375rem",
      "--theme-font": "'Inter', sans-serif",
    },
    componentVariants: {
      button: "square",
      card: "flat",
      hero: "full-bleed",
      section: "compact",
      divider: "bold",
      productCard: "standard",
    },
    blockStyleDefaults: {
      hero: {
        defaultAlign: "left",
        defaultOverlay: "80",
        defaultHeight: "full",
        defaultLayout: "split-left",
        fullWidth: true,
      },
      featureList: {
        cardStyle: "flat",
        iconPosition: "left",
        columns: 3,
      },
      callToAction: {
        centeredLayout: false,
        showSecondaryButton: true,
        backgroundStyle: "solid",
      },
      testimonials: {
        layout: "cards",
        showAvatar: false,
        cardStyle: "flat",
      },
      productGrid: {
        columns: 3,
        showPrice: true,
        cardStyle: "standard",
      },
      trustBar: {
        layout: "row",
        iconSize: "lg",
      },
      benefitStack: {
        layout: "timeline",
        showIcons: true,
      },
      protocolBuilder: {
        showDisclaimer: true,
        highlightLevel: "advanced",
      },
      recoveryUseCases: {
        layout: "grid",
        showBullets: true,
      },
      divider: {
        style: "bold",
      },
    },
  },
];

export function getThemePackPreset(id: string): ThemePackPreset | undefined {
  return themePackPresets.find((p) => p.id === id);
}
