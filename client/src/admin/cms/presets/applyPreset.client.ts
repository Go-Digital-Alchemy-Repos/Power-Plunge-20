import type { SitePreset, NavPreset, FooterPreset, SeoDefaults, GlobalCtaDefaults } from "../../../cms/presets/sitePresets.types";

export interface PresetPreviewState {
  active: boolean;
  presetId: string;
  presetName: string;
  themePackId: string;
  navPreset: NavPreset | null;
  footerPreset: FooterPreset | null;
  seoDefaults: SeoDefaults | null;
  globalCtaDefaults: GlobalCtaDefaults | null;
  homePageSeedMode: string;
}

const STORAGE_KEY = "cms_preset_preview";

export function startPreview(preset: SitePreset): PresetPreviewState {
  const state: PresetPreviewState = {
    active: true,
    presetId: preset.id,
    presetName: preset.name,
    themePackId: preset.themePackId,
    navPreset: preset.navPreset || null,
    footerPreset: preset.footerPreset || null,
    seoDefaults: preset.seoDefaults || null,
    globalCtaDefaults: preset.globalCtaDefaults || null,
    homePageSeedMode: preset.homePageSeedMode || "doNothing",
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function getPreviewState(): PresetPreviewState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw) as PresetPreviewState;
    return state.active ? state : null;
  } catch {
    return null;
  }
}

export function clearPreview(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function isPreviewActive(): boolean {
  return getPreviewState() !== null;
}

export function getEffectiveThemePackId(liveThemeId: string): string {
  const preview = getPreviewState();
  return preview ? preview.themePackId : liveThemeId;
}

export function getEffectiveNavPreset(liveNav: NavPreset | null): NavPreset | null {
  const preview = getPreviewState();
  return preview?.navPreset || liveNav;
}

export function getEffectiveFooterPreset(liveFooter: FooterPreset | null): FooterPreset | null {
  const preview = getPreviewState();
  return preview?.footerPreset || liveFooter;
}

export function getEffectiveSeoDefaults(liveSeo: SeoDefaults | null): SeoDefaults | null {
  const preview = getPreviewState();
  return preview?.seoDefaults || liveSeo;
}

export function getEffectiveCtaDefaults(liveCta: GlobalCtaDefaults | null): GlobalCtaDefaults | null {
  const preview = getPreviewState();
  return preview?.globalCtaDefaults || liveCta;
}

export async function fetchPreview(presetId: string): Promise<{
  presetId: string;
  presetName: string;
  themePackId: string;
  navPreset: unknown;
  footerPreset: unknown;
  seoDefaults: unknown;
  globalCtaDefaults: unknown;
  homePageSeedMode: string;
  diff: {
    themeWillChange: boolean;
    navWillChange: boolean;
    footerWillChange: boolean;
    seoWillChange: boolean;
    ctaWillChange: boolean;
    homePageAction: string;
  };
}> {
  const res = await fetch(`/api/admin/cms/site-presets/${presetId}/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch preview");
  return res.json();
}

export async function activatePreset(presetId: string): Promise<{
  success: boolean;
  presetId: string;
  presetName: string;
  snapshotId: string;
  changes: string[];
}> {
  const res = await fetch(`/api/admin/cms/site-presets/${presetId}/activate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to activate preset");
  clearPreview();
  return res.json();
}

export async function rollbackPreset(): Promise<{
  success: boolean;
  snapshotId: string;
}> {
  const res = await fetch("/api/admin/cms/site-presets/rollback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to rollback");
  clearPreview();
  return res.json();
}
