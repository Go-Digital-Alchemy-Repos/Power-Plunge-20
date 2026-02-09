# Apply Engine + History

The Apply Engine is the server-side system responsible for previewing, activating, and rolling back Site Presets. It manages state transitions for the site configuration and maintains a full history of every activation with snapshots for safe rollback.

## Architecture

```
client/src/admin/cms/presets/applyPreset.client.ts  → Client-side preview helpers
server/src/services/cms.sitePresets.apply.service.ts → Apply engine (preview, activate, rollback)
server/src/repositories/cms.sitePresets.repo.ts      → Snapshot storage, site settings writes
shared/schema.ts                                       → presetApplyHistory table definition
```

## Apply Engine Service

The `SitePresetApplyService` class (`server/src/services/cms.sitePresets.apply.service.ts`) exposes three core operations:

### preview(presetId)

Generates a non-destructive diff between the preset's config and the current site settings. Returns:

```typescript
interface PreviewResult {
  presetId: string;
  presetName: string;
  themePackId: string;
  navPreset: unknown;
  footerPreset: unknown;
  seoDefaults: unknown;
  globalCtaDefaults: unknown;
  homePageSeedMode: string;
  currentSettings: SiteSettingsSnapshot;
  diff: {
    themeWillChange: boolean;
    navWillChange: boolean;
    footerWillChange: boolean;
    seoWillChange: boolean;
    ctaWillChange: boolean;
    homePageAction: string;
  };
}
```

The diff is computed by comparing JSON-serialized values of each setting. No data is persisted during preview.

### activate(presetId, adminEmail?, notes?)

Applies the preset to the live site. Follows this sequence:

1. **Load preset** — Fetches the preset config from the database
2. **Snapshot current state** — Calls `getCurrentSettings()` to capture the full current configuration:
   - `activeThemeId`, `activePresetId`
   - `navPreset`, `footerPreset`, `seoDefaults`, `globalCtaDefaults`
   - Home page ID, slug, and template
3. **Save snapshot** — Inserts a row into `preset_apply_history` with the full snapshot
4. **Apply settings** — Updates `site_settings` with the preset's values (theme, nav, footer, SEO, CTA)
5. **Execute homepage action** — Based on `homePageSeedMode`:
   - `createFromTemplate`: Creates a new draft home page
   - `applyToExistingHome`: Updates the existing home page's template
   - `doNothing`: No homepage changes
6. **Audit log** — Records the activation with preset name, snapshot ID, and list of changes

Returns:

```typescript
interface ActivateResult {
  success: boolean;
  presetId: string;
  presetName: string;
  snapshotId: string;
  changes: string[];  // Human-readable list of what changed
}
```

### rollback(adminEmail?)

Restores the site to its state before the most recent activation:

1. **Find latest snapshot** — Queries `preset_apply_history` for the most recent non-rolled-back entry
2. **Restore settings** — Writes the snapshot's values back to `site_settings`
3. **Mark rolled back** — Sets `rolledBack: true` on the snapshot row
4. **Audit log** — Records the rollback

Returns:

```typescript
interface RollbackResult {
  success: boolean;
  snapshotId: string;
  restoredSettings: SiteSettingsSnapshot;
}
```

## Snapshot Contents

Every activation creates a snapshot stored in `preset_apply_history`. The snapshot captures the complete site state at the moment before activation:

```typescript
interface SiteSettingsSnapshot {
  activeThemeId: string | null;
  activePresetId: string | null;
  navPreset: unknown;
  footerPreset: unknown;
  seoDefaults: unknown;
  globalCtaDefaults: unknown;
  homePageId: string | null;
  homePageSlug: string | null;
  homePageTemplate: string | null;
}
```

The `preset_apply_history` table schema:

| Column | Type | Description |
|--------|------|-------------|
| `id` | varchar (UUID) | Primary key |
| `presetId` | varchar | ID of the preset that was activated |
| `presetName` | varchar | Name of the preset (for display in history) |
| `adminEmail` | varchar | Email of the admin who performed the action |
| `action` | varchar | Always `"activate"` for forward activations |
| `snapshot` | jsonb | Full `SiteSettingsSnapshot` object |
| `notes` | text | Optional admin-provided notes |
| `rolledBack` | boolean | Whether this snapshot has been rolled back |
| `createdAt` | timestamp | When the activation occurred |

## History API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/admin/cms/site-presets/apply-history` | List all activation history entries (newest first) |
| `GET` | `/api/admin/cms/site-presets/apply-history/:id` | Get a single history entry with full snapshot |

## Rollback Procedure

To roll back to a previous site configuration:

### Via the Admin UI

1. Navigate to `/admin/cms/presets`
2. Scroll to the **Apply History** section at the bottom
3. Click the **Rollback** button
4. Confirm the rollback in the dialog
5. The site settings revert to the state captured in the most recent snapshot

### Via the API

```
POST /api/admin/cms/site-presets/rollback
```

No request body is required. The engine automatically uses the latest non-rolled-back snapshot.

### Important Notes

- Rollback restores `site_settings` values (theme, nav, footer, SEO, CTA, active preset ID)
- Rollback does **not** undo homepage changes (created pages remain, template changes persist)
- Each snapshot can only be rolled back once (the `rolledBack` flag prevents double-rollback)
- If no activation history exists, the rollback returns an error: "No activation history found to rollback"

## Audit Trail

All apply engine actions are recorded in the `audit_logs` table:

| Action | Entity Type | Details |
|--------|-------------|---------|
| `site_preset.activated` | Preset ID | Preset name, snapshot ID, list of changes |
| `site_preset.rolled_back` | Preset ID | Snapshot ID, preset name |
| `site_settings.updated` | `main` | List of updated fields |

## Verification Steps

1. **Verify preview:** `POST /api/admin/cms/site-presets/:id/preview` should return a diff without modifying any data
2. **Verify activation:** `POST /api/admin/cms/site-presets/:id/activate` should create a history entry and update `site_settings`
3. **Verify snapshot:** `GET /api/admin/cms/site-presets/apply-history` should show the activation with full snapshot data
4. **Verify rollback:** `POST /api/admin/cms/site-presets/rollback` should restore the previous settings and mark the snapshot as rolled back
5. **Verify audit:** Check `audit_logs` for `site_preset.activated` and `site_preset.rolled_back` entries

## Source Code

| File | Purpose |
|------|---------|
| `server/src/services/cms.sitePresets.apply.service.ts` | Apply engine (preview, activate, rollback) |
| `server/src/repositories/cms.sitePresets.repo.ts` | Snapshot CRUD, settings read/write |
| `client/src/admin/cms/presets/applyPreset.client.ts` | Client-side preview/activate/rollback helpers |
| `shared/schema.ts` | `presetApplyHistory` table, `auditLogs` table |
