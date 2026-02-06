import { z } from "zod";

export const themeColorTokensSchema = z.object({
  colorBg: z.string().min(1),
  colorSurface: z.string().min(1),
  colorSurfaceAlt: z.string().min(1),
  colorText: z.string().min(1),
  colorTextMuted: z.string().min(1),
  colorBorder: z.string().min(1),
  colorPrimary: z.string().min(1),
  colorPrimaryText: z.string().min(1),
  colorSecondary: z.string().min(1),
  colorSecondaryText: z.string().min(1),
  colorAccent: z.string().min(1),
  colorAccentText: z.string().min(1),
  colorSuccess: z.string().min(1),
  colorWarning: z.string().min(1),
  colorDanger: z.string().min(1),
});

export const themeTypographyTokensSchema = z.object({
  fontFamilyBase: z.string().min(1),
  fontSizeScale: z.number().min(0.5).max(2),
  lineHeightBase: z.number().min(1).max(3),
  letterSpacingBase: z.string(),
});

export const themeRadiusTokensSchema = z.object({
  radiusSm: z.string(),
  radiusMd: z.string(),
  radiusLg: z.string(),
  radiusXl: z.string(),
});

export const themeShadowTokensSchema = z.object({
  shadowSm: z.string(),
  shadowMd: z.string(),
  shadowLg: z.string(),
});

export const themeSpacingTokensSchema = z.object({
  spaceBase: z.number().min(1).max(16),
  spaceScale: z.array(z.number()).min(1).max(12),
});

export const themeButtonTokensSchema = z.object({
  buttonRadius: z.enum(["sm", "md", "lg"]),
  buttonStyle: z.enum(["solid", "soft", "outline"]),
  buttonPaddingY: z.string(),
  buttonPaddingX: z.string(),
});

export const themeLayoutTokensSchema = z.object({
  containerMaxWidth: z.number().min(640).max(2560),
  sectionPaddingY: z.string(),
  sectionPaddingX: z.string(),
});

export const themeTokensSchema = z.object({
  colors: themeColorTokensSchema,
  typography: themeTypographyTokensSchema,
  radius: themeRadiusTokensSchema,
  shadows: themeShadowTokensSchema,
  spacing: themeSpacingTokensSchema,
  buttons: themeButtonTokensSchema,
  layout: themeLayoutTokensSchema,
});

export const themeTokenPresetSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  tokens: themeTokensSchema,
});

export type ThemeTokensInput = z.infer<typeof themeTokensSchema>;
export type ThemeTokenPresetInput = z.infer<typeof themeTokenPresetSchema>;
