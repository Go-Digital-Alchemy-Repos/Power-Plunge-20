# Export / Import

Site Presets can be exported as JSON files and imported into other environments. This enables moving preset configurations between development, staging, and production instances.

## Export

### Via the Admin UI

1. Navigate to `/admin/cms/presets`
2. Click the **Export** button (download icon) on any preset card
3. A JSON file is downloaded to your browser with the preset's full configuration

### Via the API

```
GET /api/admin/cms/site-presets/:id/export
```

Response: a JSON object containing all preset fields, including config, tags, and metadata. The export includes:

| Field | Included | Notes |
|-------|----------|-------|
| `name` | Yes | Preset display name |
| `description` | Yes | Preset description |
| `tags` | Yes | Array of tags |
| `previewImage` | Yes | Preview image URL (may not resolve in other environments) |
| `config` | Yes | Full configuration object (theme, nav, footer, SEO, CTA, etc.) |
| `createdAt` | No | Stripped on export |
| `updatedAt` | No | Stripped on export |
| `id` | No | A new ID is generated on import |

## Import

### Via the Admin UI

1. Navigate to `/admin/cms/presets`
2. Click **Import** in the top toolbar
3. Select a JSON file previously exported from another environment
4. The preset is validated and created with a new ID
5. The imported preset appears in the grid

### Via the API

```
POST /api/admin/cms/site-presets/import
Content-Type: application/json

{
  "name": "Imported Preset",
  "description": "...",
  "tags": ["imported"],
  "config": { ... }
}
```

The import endpoint validates the incoming data against the same Zod schema used for creating presets. Invalid data returns a `400` error with details.

## Dependency Remapping

When moving presets between environments, certain references may need manual attention:

### Theme Pack IDs

Theme pack IDs (e.g., `performance-tech`, `spa-minimal`) are defined in `shared/themePackPresets.ts` and are consistent across all environments. No remapping is needed for built-in theme packs.

If a custom theme pack ID is referenced that doesn't exist in the target environment, the theme activation step will apply the ID but the visual rendering may fall back to defaults.

### Template IDs

Template IDs (e.g., `landing-page-v1`, `product-story-v1`, `sales-funnel-v1`) are defined in `client/src/cms/templates/templateLibrary.ts` and are consistent across environments. No remapping is needed.

### Section Kit Names

Section kits referenced in `defaultKitsSectionIds` are resolved by name against the saved sections in the CMS. If the target environment doesn't have the referenced kits:
- The kit names are stored in the preset config as-is
- When the preset is used for campaign generation, missing kits are silently skipped
- To ensure kits are available, navigate to `/admin/cms/sections` and click "Load Starter Kits" in the target environment

### Navigation and Footer Links

Nav items and footer links reference URLs (e.g., `/shop`, `/faq`). These are stored as-is. If the target environment has different page slugs, update the nav/footer items in the imported preset after import.

### Preview Images

If the preset includes a `previewImage` URL, it may not resolve in the target environment. The preview image is purely cosmetic and does not affect preset functionality. Update or clear it after import if needed.

## Workflow: Moving a Preset to Production

1. **Export** the preset from the development environment via the admin UI or API
2. **Import** the JSON file into the production environment
3. **Verify** section kits exist — seed starter kits if needed
4. **Review** nav/footer links — update URLs if page slugs differ
5. **Preview** the imported preset to confirm the visual appearance
6. **Activate** when ready

## Verification Steps

1. **Export a preset:** Click export on a preset card, confirm a JSON file downloads
2. **Inspect the JSON:** Verify it contains `name`, `description`, `tags`, and `config` with theme, nav, footer, SEO, and CTA settings
3. **Import the file:** Use the Import button, select the file, confirm the preset appears in the grid
4. **Compare configs:** Open the imported preset and verify all settings match the original
5. **Activate imported preset:** Preview and activate to confirm it works correctly in the target environment

## Source Code

| File | Purpose |
|------|---------|
| `server/src/services/cms.sitePresets.service.ts` | `exportPreset()` and `importPreset()` methods |
| `server/src/routes/cms.sitePresets.routes.ts` | `GET /:id/export` and `POST /import` endpoints |
| `server/src/schemas/cms.sitePresets.schema.ts` | Validation schema for import data |
| `client/src/pages/admin-cms-presets.tsx` | Export button and import file handler in UI |
