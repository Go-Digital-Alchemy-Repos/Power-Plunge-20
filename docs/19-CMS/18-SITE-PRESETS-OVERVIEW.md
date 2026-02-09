# Site Presets Overview

Site Presets are full-site composition bundles that package a theme pack, navigation, footer, SEO defaults, CTA defaults, homepage template, and section kits into a single activatable configuration. Activating a preset applies all of these settings to the storefront at once, providing a one-click way to establish or change the entire visual identity and structural layout of the site.

## What a Preset Controls

Each preset contains a config object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `themePackId` | string | The theme pack to activate (e.g., `performance-tech`, `spa-minimal`) |
| `defaultThemePresetId` | string? | Optional fallback color theme within the pack |
| `homepageTemplateId` | string? | Template to assign to the homepage (e.g., `landing-page-v1`) |
| `defaultKitsSectionIds` | string[]? | Section kit names to include by default on generated pages |
| `defaultInsertMode` | `"sectionRef"` \| `"detach"` | How kits are inserted (linked or detached copies) |
| `navPreset` | NavPreset? | Navigation layout and items |
| `footerPreset` | FooterPreset? | Footer columns and links |
| `globalCtaDefaults` | GlobalCtaDefaults? | Default primary/secondary CTA text and href |
| `seoDefaults` | SeoDefaults? | Site name, title suffix, meta description, robots directives |
| `homePageSeedMode` | enum? | What to do with the homepage on activation |
| `applyScope` | enum? | Whether changes affect storefront only or admin + storefront |

### Navigation Preset

Controls the site header navigation:

```typescript
{
  styleVariant: "minimal" | "centered" | "split" | "stacked",
  items: [
    { label: "Home", href: "/", type: "page" },
    { label: "Shop", href: "/shop", type: "page" },
  ]
}
```

### Footer Preset

Controls footer columns and links:

```typescript
{
  columns: [
    { title: "Shop", links: [{ label: "Products", href: "/shop" }] },
    { title: "Support", links: [{ label: "FAQ", href: "/faq" }] },
  ],
  showSocial: true
}
```

### SEO Defaults

Site-wide SEO configuration:

```typescript
{
  siteName: "PowerPlunge",
  titleSuffix: " | PowerPlunge",
  defaultMetaDescription: "Professional-grade cold plunge tanks...",
  ogDefaultImage: "/images/og-default.jpg",
  robotsIndex: true,
  robotsFollow: true
}
```

### Global CTA Defaults

Default call-to-action text used across generated pages:

```typescript
{
  primaryCtaText: "Shop Now",
  primaryCtaHref: "/shop",
  secondaryCtaText: "Learn More",
  secondaryCtaHref: "/about"
}
```

### Homepage Seed Mode

Controls what happens to the homepage when a preset is activated:

| Mode | Behavior |
|------|----------|
| `createFromTemplate` | Creates a new draft home page using the preset's `homepageTemplateId` |
| `applyToExistingHome` | Updates the existing home page's template without creating a new page |
| `doNothing` | Leaves the homepage unchanged (default) |

## Preview vs Activate vs Rollback

### Preview

Preview shows what will change **before** committing. The preview API returns a diff object showing which settings will be modified:

```
POST /api/admin/cms/site-presets/:id/preview
```

Response includes:
- The preset's theme, nav, footer, SEO, and CTA configurations
- The current site settings for comparison
- A diff object with boolean flags: `themeWillChange`, `navWillChange`, `footerWillChange`, `seoWillChange`, `ctaWillChange`, and `homePageAction`

No data is persisted during preview. The admin UI also applies a DOM-only theme preview that reverts when dismissed.

### Activate

Activation persists all preset settings to the `site_settings` table and optionally modifies the homepage. Before applying changes, the engine takes a full snapshot of the current site settings for rollback safety.

```
POST /api/admin/cms/site-presets/:id/activate
```

The activation process:
1. Takes a snapshot of current `site_settings` (saved to `preset_apply_history`)
2. Applies the preset's theme, nav, footer, SEO, and CTA to `site_settings`
3. Executes the homepage seed mode if applicable
4. Logs the activation in the audit log with all changes listed

Response includes the snapshot ID, preset name, and a list of all changes made.

### Rollback

Rollback restores the site settings captured in the most recent activation snapshot:

```
POST /api/admin/cms/site-presets/rollback
```

The rollback process:
1. Retrieves the latest non-rolled-back snapshot from `preset_apply_history`
2. Restores all settings from the snapshot (theme, nav, footer, SEO, CTA, active preset ID)
3. Marks the snapshot as rolled back
4. Logs the rollback in the audit log

Rollback does **not** undo homepage changes (page creation or template changes). Those must be managed manually through the Pages list.

## Built-in Presets (6 Seeds)

| Preset | Theme Pack | Template | Nav Style | Kits |
|--------|-----------|----------|-----------|------|
| Performance Tech Starter | `performance-tech` | `landing-page-v1` | minimal | Benefits, Safety, Warranty |
| Spa Minimal Starter | `spa-minimal` | `product-story-v1` | centered | Delivery, Financing |
| Clinical Clean Starter | `clinical-clean` | `landing-page-v1` | split | Benefits, Safety, Warranty |
| Luxury Wellness Starter | `luxury-wellness` | `product-story-v1` | stacked | Benefits, Delivery, Financing |
| Dark Performance Starter | `dark-performance` | `sales-funnel-v1` | minimal | Benefits, Safety |
| Balanced Default Starter | `performance-tech` | `landing-page-v1` | minimal | Benefits, Safety, Delivery |

Seeds are loaded via `POST /api/admin/cms/site-presets/seed`. Seeding is idempotent — it checks for existing presets by name before inserting.

## Feature Flag

Site Presets require `CMS_ENABLED=true`. All routes are mounted under `/api/admin/cms/site-presets/` and require admin authentication.

## Canonical Site Settings

When a preset is activated, the settings are written to the `site_settings` table (row `id="main"`), which serves as the single source of truth. The canonical site settings endpoint:

- `GET /api/admin/cms/site-settings` — Read current global settings
- `PUT /api/admin/cms/site-settings` — Update global settings directly (independent of presets)

These endpoints validate using shared Zod schemas (`navPresetSchema`, `footerPresetSchema`, `seoDefaultsSchema`, `globalCtaDefaultsSchema`).

## Source Code

| File | Purpose |
|------|---------|
| `client/src/cms/presets/sitePresets.types.ts` | TypeScript interfaces for preset config |
| `server/src/schemas/cms.sitePresets.schema.ts` | Zod validation schemas |
| `server/src/repositories/cms.sitePresets.repo.ts` | Database operations (CRUD, snapshots, settings) |
| `server/src/services/cms.sitePresets.service.ts` | Business logic for CRUD and import/export |
| `server/src/services/cms.sitePresets.apply.service.ts` | Preview, activate, and rollback engine |
| `server/src/routes/cms.sitePresets.routes.ts` | API route definitions |
| `server/src/services/cms.siteSettings.service.ts` | Canonical site settings service |
| `server/src/routes/cms.siteSettings.routes.ts` | Site settings GET/PUT endpoints |
| `server/src/data/sitePresetSeeds.ts` | 6 pre-configured seed presets |
| `client/src/pages/admin-cms-presets.tsx` | Presets Manager admin UI |
| `shared/schema.ts` | Database schema (`sitePresets`, `siteSettings`, `presetApplyHistory`, `auditLogs`) |
