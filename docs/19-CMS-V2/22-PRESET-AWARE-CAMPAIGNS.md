# Preset-Aware Campaign Generator

The Campaign Pack generator supports optional Site Preset inheritance. When a preset is selected during campaign generation, all generated pages inherit the preset's theme, SEO defaults, CTA text, and optionally its default section kits.

## How Presets Affect Generated Pages

Without a preset, campaign pages use the pack's own `recommendedThemePreset` and built-in defaults. With a preset selected, the assembly engine applies `PresetOverrides` that customize the output:

| Setting | Without Preset | With Preset |
|---------|---------------|-------------|
| **Theme** | Pack's `recommendedThemePreset` | Preset's `themePackId` |
| **SEO title suffix** | None | Preset's `seoDefaults.titleSuffix` appended |
| **SEO meta description** | Page's `defaultSeoDescription` | Falls back to preset's `defaultMetaDescription` if page has none |
| **SEO site name** | None | Preset's `seoDefaults.siteName` |
| **CTA text** | Template defaults | Preset's `globalCtaDefaults` (primary/secondary text and href) |
| **Section kits** | Pack `defaultKits` + page `recommendedKits` | Optionally prepended with preset's `defaultKitsSectionIds` |

### Kit Prepending

When a preset is selected and the "Prepend preset kits" toggle is enabled, the preset's `defaultKitsSectionIds` are added **before** the campaign pack's own kits. The merge order is:

```
1. Preset default kits (prepended)
2. Page-level recommendedKits
3. Pack-level defaultKits
```

Duplicates are removed. If the toggle is off, only the pack's kits are used.

### Theme Override

The preset's `themePackId` replaces the campaign pack's `recommendedThemePreset`. This means all pages in the campaign use the preset's theme instead of the pack's recommended theme.

### SEO Override

- **Title suffix:** If the preset defines `seoDefaults.titleSuffix`, it is appended to each page's SEO title
- **Meta description fallback:** If a page definition doesn't include a `defaultSeoDescription`, the preset's `defaultMetaDescription` is used
- **Site name:** Added to each page's SEO metadata if defined in the preset

### CTA Override

If the preset defines `globalCtaDefaults`, the CTA block in each generated page uses:
- `primaryCtaText` and `primaryCtaHref` from the preset
- `secondaryCtaText` and `secondaryCtaHref` from the preset

These override the template's default CTA text.

## When to Use Preset Inheritance

### Use a Preset When

- You want all campaign pages to match the current site identity (theme, nav style, CTA)
- You are generating pages for a brand that already has an active preset
- You want consistent SEO settings (title suffix, site name) across all generated pages
- You want to include standard section kits from the preset on every campaign page

### Skip the Preset When

- The campaign targets a specific audience with a unique theme (e.g., a Black Friday event page with a dark theme)
- The pack's recommended theme is intentionally different from the site preset
- You want full control over kits without preset defaults being prepended

## Using the Campaign Generator with Presets

1. Navigate to `/admin/cms-v2/generator/campaigns`
2. Select a campaign pack card
3. Click **Generate Campaign**
4. In the confirmation dialog:
   - Select a product from the **Featured Product** dropdown
   - Select a preset from the **Apply Site Preset** dropdown (or leave as "None")
   - When a preset is selected, visual badges appear showing the applied settings (theme, SEO suffix, CTA text)
   - Toggle **Prepend preset default kits** on/off to control kit inheritance
5. Click **Generate N Pages**
6. Review generated pages in the Pages list

## Technical Details

### PresetOverrides Interface

The assembly engine accepts an optional `PresetOverrides` object via `AssemblyInput.presetOverrides`:

```typescript
interface PresetOverrides {
  themePackId?: string;
  seoDefaults?: {
    siteName?: string;
    titleSuffix?: string;
    defaultMetaDescription?: string;
    ogDefaultImage?: string;
  };
  globalCtaDefaults?: {
    primaryCtaText?: string;
    primaryCtaHref?: string;
    secondaryCtaText?: string;
    secondaryCtaHref?: string;
  };
}
```

Kit prepending is handled separately via `generateCampaignPack()` options:

```typescript
options: {
  presetOverrides?: PresetOverrides;   // Theme, SEO, CTA overrides
  presetKitNames?: string[];           // Kit names from the preset's defaultKitsSectionIds
  prependPresetKits?: boolean;         // Whether to prepend preset kits (default: false)
}
```

The `generateCampaignPack()` function constructs `PresetOverrides` from the selected preset's config and passes kit names separately.

### Assembly Flow with Preset

```
Campaign Pack selected
  ├─ Preset selected? → Build PresetOverrides from preset config
  ├─ For each page definition:
  │   ├─ assembleLandingPage(input, presetOverrides)
  │   │   ├─ Apply theme from preset (overrides pack theme)
  │   │   ├─ Apply SEO overrides (suffix, description fallback)
  │   │   ├─ Apply CTA overrides
  │   │   └─ Merge kits (preset prepend + page + pack)
  │   └─ POST to CMS API as draft
  └─ Show results
```

## Verification Steps

1. Navigate to `/admin/cms-v2/generator/campaigns`
2. Select any campaign pack
3. Click "Generate Campaign"
4. Select a preset from the dropdown — verify badges appear showing theme, SEO suffix, and CTA text
5. Generate the campaign
6. Open a generated page in the page builder
7. Verify:
   - The page uses the preset's theme (not the pack's recommended theme)
   - SEO title includes the preset's suffix
   - CTA block text matches the preset's CTA defaults
   - If kit prepending was enabled, the preset's kits appear before the pack's kits

## Source Code

| File | Purpose |
|------|---------|
| `client/src/admin/cms-v2/generator/assembleLandingPage.ts` | Assembly engine with `PresetOverrides` support |
| `client/src/admin/cms-v2/generator/assembleCampaignPack.ts` | `generateCampaignPack()` with preset option |
| `client/src/pages/admin-cms-v2-generator-campaigns.tsx` | Campaign UI with preset dropdown and badges |
| `client/src/cms/presets/sitePresets.types.ts` | Preset type definitions |
