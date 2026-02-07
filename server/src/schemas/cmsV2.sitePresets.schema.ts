import { z } from "zod";

export const navItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  type: z.enum(["page", "external", "anchor"]).optional(),
  pageId: z.string().optional(),
});

export const navPresetSchema = z.object({
  styleVariant: z.enum(["minimal", "centered", "split", "stacked"]).optional(),
  items: z.array(navItemSchema),
});

export const footerLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const footerColumnSchema = z.object({
  title: z.string().min(1),
  links: z.array(footerLinkSchema),
});

export const footerPresetSchema = z.object({
  columns: z.array(footerColumnSchema),
  showSocial: z.boolean().optional(),
});

export const globalCtaDefaultsSchema = z.object({
  primaryCtaText: z.string().optional(),
  primaryCtaHref: z.string().optional(),
  secondaryCtaText: z.string().optional(),
  secondaryCtaHref: z.string().optional(),
});

export const seoDefaultsSchema = z.object({
  siteName: z.string().optional(),
  titleSuffix: z.string().optional(),
  defaultMetaDescription: z.string().optional(),
  ogDefaultImage: z.string().optional(),
  robotsIndex: z.boolean().optional(),
  robotsFollow: z.boolean().optional(),
});

export const sitePresetSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  previewImage: z.string().optional(),

  themePackId: z.string().min(1),
  defaultThemePresetId: z.string().optional(),
  homepageTemplateId: z.string().optional(),
  defaultKitsSectionIds: z.array(z.string()).optional(),
  defaultInsertMode: z.enum(["sectionRef", "detach"]).default("sectionRef"),

  navPreset: navPresetSchema.optional(),
  footerPreset: footerPresetSchema.optional(),

  globalCtaDefaults: globalCtaDefaultsSchema.optional(),
  seoDefaults: seoDefaultsSchema.optional(),

  homePageSeedMode: z.enum(["createFromTemplate", "applyToExistingHome", "doNothing"]).default("createFromTemplate"),
  applyScope: z.enum(["storefrontOnly", "adminAndStorefront"]).default("storefrontOnly"),
});

export const insertSitePresetSchema = sitePresetSchema.omit({ id: true });

export type SitePresetInput = z.infer<typeof sitePresetSchema>;
export type InsertSitePresetInput = z.infer<typeof insertSitePresetSchema>;

export type NavItem = z.infer<typeof navItemSchema>;
export type NavPreset = z.infer<typeof navPresetSchema>;
export type FooterLink = z.infer<typeof footerLinkSchema>;
export type FooterColumn = z.infer<typeof footerColumnSchema>;
export type FooterPreset = z.infer<typeof footerPresetSchema>;
export type GlobalCtaDefaults = z.infer<typeof globalCtaDefaultsSchema>;
export type SeoDefaults = z.infer<typeof seoDefaultsSchema>;
