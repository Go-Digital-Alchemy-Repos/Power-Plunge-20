# Presets Manager UI Guide

The Presets Manager is the admin interface for creating, editing, previewing, activating, and managing Site Presets. It is accessible at `/admin/cms/presets` and appears in the CMS sidebar under "Presets."

## Access

- **Admin URL:** `/admin/cms/presets`
- **Sidebar:** CMS → Presets
- **Requires:** Admin authentication with full access (admin or store_manager role)
- **Feature flag:** Requires `CMS_ENABLED=true`

## Page Layout

The Presets Manager is divided into two main sections:

1. **Presets Grid** — Cards for each saved preset with action buttons
2. **Apply History** — Timeline of preset activations and rollbacks

A toolbar at the top provides:
- **Seed Presets** button — Loads the 6 built-in starter presets
- **Import** button — Imports a preset from a JSON file
- **Create New** button — Opens the preset creation form

## Creating a Preset

1. Click **Create New** in the top toolbar
2. Fill in the preset form:
   - **Name** (required) — Display name for the preset
   - **Description** — Brief explanation of the preset's purpose
   - **Tags** — Comma-separated tags for organization (e.g., `starter, wellness, spa`)
   - **Theme Pack** — Select from available theme packs (Performance Tech, Spa Minimal, etc.)
   - **Homepage Template** — Select a page template for homepage creation
   - **Default Kits** — Section kit names to include on generated pages
   - **Nav Preset** — Navigation style variant and menu items
   - **Footer Preset** — Footer columns and links
   - **SEO Defaults** — Site name, title suffix, meta description, robots directives
   - **CTA Defaults** — Primary and secondary call-to-action text and URLs
   - **Homepage Seed Mode** — What to do with the homepage on activation
   - **Apply Scope** — Storefront only or admin and storefront
3. Click **Save** to create the preset

## Editing a Preset

1. Find the preset card in the grid
2. Click the **edit** icon on the card
3. The same form opens pre-filled with the preset's current values
4. Make changes and click **Save**

All edits are validated against Zod schemas before saving. Invalid data shows inline errors.

## Duplicating a Preset

1. Click the **duplicate** icon (copy icon) on any preset card
2. A new preset is created with the name `"[Original Name] (Copy)"`
3. The duplicate appears in the grid and can be edited independently

Duplicating is useful for creating variations of an existing preset without starting from scratch.

## Preview Workflow

Previewing shows what a preset will change before committing:

1. Click **Preview** (eye icon) on a preset card
2. The UI applies a DOM-only theme preview — the admin interface temporarily shows the preset's color scheme
3. A preview banner appears showing the preset name and a diff of what will change
4. The preview is purely visual and client-side — no data is persisted
5. Click the active preview card again or click another preset to dismiss the preview

## Activate Workflow

Activating a preset applies all its settings to the live site:

1. Click **Activate** (zap icon) on a preset card
2. A confirmation dialog appears showing what will change
3. Optionally add notes explaining why this preset is being activated
4. Click **Confirm Activation**
5. The engine:
   - Takes a snapshot of current settings (for rollback)
   - Applies all preset settings to `site_settings`
   - Executes the homepage seed mode if configured
6. A success toast confirms the activation
7. The preset card shows an "Active" badge
8. A new entry appears in the Apply History section

## Rollback

1. Scroll to the **Apply History** section
2. Click the **Rollback** button (rotate icon)
3. The site settings revert to the state before the most recent activation
4. A success toast confirms the rollback

Rollback is only available when there is at least one non-rolled-back activation in the history.

## Deleting a Preset

1. Click the **delete** icon (trash icon) on a preset card
2. Confirm the deletion
3. The preset is permanently removed

Deleting a preset does not affect the current site settings, even if the deleted preset was the last one activated.

## Seeding Starter Presets

If no presets exist yet (fresh environment):

1. Click **Seed Presets** in the top toolbar
2. The 6 built-in starter presets are created
3. Each seed includes a complete configuration (theme, nav, footer, SEO, CTA, kits)

Seeding is idempotent — running it again will not create duplicates if presets with the same names already exist.

## Best Practices

### When to Create a New Preset

- **New brand identity** — When launching a new visual direction (e.g., switching from athletic to wellness positioning)
- **Seasonal campaigns** — Create presets for holiday-specific site themes with appropriate nav, footer, and CTA text
- **A/B comparison** — Create two presets with different configurations, activate one, review results, then try the other
- **Client demos** — Create presets for different client presentations to switch between looks instantly

### Naming Conventions

- Use descriptive names that indicate the visual style or purpose: `"Holiday 2026 Wellness"`, `"Athletic Performance Q2"`
- Add tags for filtering: `starter`, `seasonal`, `client-demo`, `testing`

### Before Activating

- Always preview first to understand what will change
- Add notes when activating to create an audit trail
- Know that rollback restores settings but not homepage page-creation changes

### Organizing Presets

- Use tags to categorize: `starter` for base configurations, `seasonal` for time-limited themes
- Duplicate a starter preset rather than editing it directly, preserving the original as a baseline
- Delete unused or experimental presets to keep the grid manageable

## Verification Steps

1. **Navigate to Presets page:** Go to `/admin/cms/presets` — the page loads with preset cards (or an empty state with the Seed Presets button)
2. **Seed presets:** Click "Seed Presets" — 6 starter presets appear in the grid
3. **Preview a preset:** Click the eye icon on a preset card — the admin UI theme changes temporarily and a preview banner appears
4. **Dismiss preview:** Click the eye icon again — the admin UI reverts to the original theme
5. **Activate a preset:** Click the zap icon → confirm activation — a success toast appears and the preset card shows an "Active" badge
6. **Check history:** Scroll to the Apply History section — the activation appears with timestamp and admin email
7. **Rollback:** Click the rollback button — the site settings revert and a success toast confirms
8. **Duplicate a preset:** Click the copy icon — a new preset named "[Name] (Copy)" appears in the grid
9. **Export a preset:** Click the download icon — a JSON file downloads
10. **Import a preset:** Click "Import" in the toolbar → select a JSON file — the imported preset appears in the grid
11. **Delete a preset:** Click the trash icon → confirm — the preset is removed from the grid

## Source Code

| File | Purpose |
|------|---------|
| `client/src/pages/admin-cms-presets.tsx` | Full Presets Manager page component |
| `client/src/admin/cms/presets/applyPreset.client.ts` | Client-side preview/activate/rollback API calls |
| `client/src/cms/presets/sitePresets.types.ts` | TypeScript interfaces |
| `server/src/routes/cms.sitePresets.routes.ts` | API routes |
