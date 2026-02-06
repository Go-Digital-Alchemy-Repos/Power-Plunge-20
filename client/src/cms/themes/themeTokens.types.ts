export interface ThemeColorTokens {
  colorBg: string;
  colorSurface: string;
  colorSurfaceAlt: string;
  colorText: string;
  colorTextMuted: string;
  colorBorder: string;
  colorPrimary: string;
  colorPrimaryText: string;
  colorSecondary: string;
  colorSecondaryText: string;
  colorAccent: string;
  colorAccentText: string;
  colorSuccess: string;
  colorWarning: string;
  colorDanger: string;
}

export interface ThemeTypographyTokens {
  fontFamilyBase: string;
  fontSizeScale: number;
  lineHeightBase: number;
  letterSpacingBase: string;
}

export interface ThemeRadiusTokens {
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
}

export interface ThemeShadowTokens {
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
}

export interface ThemeSpacingTokens {
  spaceBase: number;
  spaceScale: number[];
}

export interface ThemeButtonTokens {
  buttonRadius: "sm" | "md" | "lg";
  buttonStyle: "solid" | "soft" | "outline";
  buttonPaddingY: string;
  buttonPaddingX: string;
}

export interface ThemeLayoutTokens {
  containerMaxWidth: number;
  sectionPaddingY: string;
  sectionPaddingX: string;
}

export interface ThemeTokens {
  colors: ThemeColorTokens;
  typography: ThemeTypographyTokens;
  radius: ThemeRadiusTokens;
  shadows: ThemeShadowTokens;
  spacing: ThemeSpacingTokens;
  buttons: ThemeButtonTokens;
  layout: ThemeLayoutTokens;
}

export interface ThemeTokenPreset {
  id: string;
  name: string;
  description: string;
  tokens: ThemeTokens;
}
