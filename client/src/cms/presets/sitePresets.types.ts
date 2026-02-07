export interface NavItem {
  label: string;
  href: string;
  type?: "page" | "external" | "anchor";
  pageId?: string;
}

export interface NavPreset {
  styleVariant?: "minimal" | "centered" | "split" | "stacked";
  items: NavItem[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterPreset {
  columns: FooterColumn[];
  showSocial?: boolean;
}

export interface GlobalCtaDefaults {
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export interface SeoDefaults {
  siteName?: string;
  titleSuffix?: string;
  defaultMetaDescription?: string;
  ogDefaultImage?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
}

export interface SitePreset {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  previewImage?: string;

  themePackId: string;
  defaultThemePresetId?: string;
  homepageTemplateId?: string;
  defaultKitsSectionIds?: string[];
  defaultInsertMode?: "sectionRef" | "detach";

  navPreset?: NavPreset;
  footerPreset?: FooterPreset;

  globalCtaDefaults?: GlobalCtaDefaults;
  seoDefaults?: SeoDefaults;

  homePageSeedMode?: "createFromTemplate" | "applyToExistingHome" | "doNothing";
  applyScope?: "storefrontOnly" | "adminAndStorefront";

  createdAt?: string;
  updatedAt?: string;
}

export type InsertSitePreset = Omit<SitePreset, "id" | "createdAt" | "updatedAt">;
