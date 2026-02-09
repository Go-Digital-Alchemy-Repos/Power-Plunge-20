# Theme Packs

Theme packs are curated design bundles that combine theme tokens, component variants, and block style defaults into a single activatable preset. They extend the existing theme system (see [Themes](07-THEMES.md)) by packaging three layers of design control into one cohesive visual identity.

## Theme Packs vs Themes

The CMS has two theming systems that work together:

| Aspect | Color Themes | Theme Packs |
|--------|-------------|-------------|
| **Controls** | CSS color variables only (`--theme-*`) | Colors + component shapes + block layout defaults |
| **Scope** | Colors, typography, radius, shadows | Full visual identity (colors, button/card styles, hero/CTA layouts) |
| **Count** | 10 built-in presets | 5 built-in packs |
| **CSS variables** | ~20 `--theme-*` variables | ~20 `--theme-*` + 26 `--cv-*` variables |
| **Block behavior** | No effect on block rendering | Overrides default layout, alignment, and style per block type |
| **Source** | `client/src/cms/themes/presets.ts` | `shared/themePackPresets.ts` |
| **Storage** | `site_settings.active_theme_id` | `site_settings.active_theme_pack_id` |

A theme pack supersedes a color theme — activating a pack applies its own color tokens, replacing whatever color theme was previously active. Both systems share the same CSS variable namespace (`--theme-*`), so they are interchangeable but not stackable.

## Structure

Every theme pack contains three layers:

```typescript
interface ThemePackPreset {
  id: string;                          // Unique identifier
  name: string;                        // Display name
  description: string;                 // Short description
  themeTokens: Record<string, string>; // CSS color/font variables
  componentVariants: ComponentVariantSelection; // Shape selections per component
  blockStyleDefaults: BlockStyleDefaultsMap;    // Layout defaults per block type
}
```

### Layer 1: Theme Tokens

A flat map of `--theme-*` CSS custom properties controlling colors, fonts, radius, and shadows. Identical in structure to color theme variables. Applied to `document.documentElement` on activation.

### Layer 2: Component Variants

A selection object mapping each component to a variant ID:

```typescript
{ button: "pill", card: "elevated", hero: "contained", ... }
```

Each selection resolves to a set of `--cv-*` CSS custom properties that control component shape, padding, shadow, and border. See [Component Variants](16-COMPONENT-VARIANTS.md).

### Layer 3: Block Style Defaults

Per-block-type default property overrides that control layout decisions like hero alignment, feature grid columns, CTA background style, and more. See [Block Style Defaults](17-BLOCK-STYLE-DEFAULTS.md).

## Built-in Packs (5)

| ID | Name | Description | Button | Card | Hero |
|----|------|-------------|--------|------|------|
| `performance-tech` | Performance Tech | Bold, high-contrast look inspired by athletic performance gear and tech dashboards | `square` | `elevated` | `full-bleed` |
| `spa-minimal` | Spa Minimal | Serene, airy aesthetic with soft pastels and generous whitespace for wellness brands | `pill` | `flat` | `contained` |
| `clinical-clean` | Clinical Clean | Crisp, authoritative design inspired by medical and scientific aesthetics | `rounded` | `outlined` | `contained` |
| `luxury-wellness` | Luxury Wellness | Premium gold-accented design with rich warm tones for high-end wellness products | `soft` | `elevated` | `full-bleed` |
| `dark-performance` | Dark Performance | Intense, high-energy dark theme with vivid cyan accents for maximum impact | `square` | `flat` | `full-bleed` |

Each pack also overrides block style defaults for 9–10 block types (hero, featureList, callToAction, testimonials, productGrid, trustBar, and domain-specific blocks).

## Preview vs Activate

### Preview

Clicking a pack card in `/admin/cms/themes` (Theme Packs tab) instantly applies the pack's combined CSS variables to the admin UI. This is a DOM-only change — no data is persisted.

The preview applies both layers simultaneously:
1. Theme tokens → set as `--theme-*` on `document.documentElement`
2. Component variant CSS vars → resolved via `resolveAllVariantStyles()` and set as `--cv-*` on `document.documentElement`

Reverting (clicking the previewed card again or switching to another) restores the original variables, including component variant defaults.

### Activate

Clicking "Activate" on a previewed pack:
1. Sends `POST /api/admin/cms/theme-packs/activate` with the pack ID
2. Stores the pack ID in `site_settings`
3. The public `ThemeProvider` applies both token and component variant CSS variables for visitors

### Restore Logic

When reverting from a pack preview back to a non-pack color theme, the system captures and restores the default component variant CSS variables (via `getDefaultSelection()`) to ensure no stale `--cv-*` values remain from the previewed pack.

## Admin UI

The themes page (`/admin/cms/themes`) uses an underline-style tab interface:

- **Color Themes tab** — The existing 10 color presets with preview cards
- **Theme Packs tab** — The 5 theme packs displayed as horizontal cards, each with:
  - A rich page thumbnail showing a simulated hero + features + CTA layout using the pack's actual tokens, variant styles, and block defaults
  - Meta badges showing token count, variant count, and block default count
  - Preview/Activate buttons

## API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `GET` | `/api/admin/cms/theme-packs` | Admin | List all 5 theme pack presets |
| `GET` | `/api/admin/cms/theme-packs/active` | Admin | Get the currently active pack (or null) |
| `POST` | `/api/admin/cms/theme-packs/activate` | Admin | Activate a pack by ID |
| `POST` | `/api/admin/cms/theme-packs/deactivate` | Admin | Deactivate the current pack (reverts to color theme) |

## How to Add a New Theme Pack

1. Open `shared/themePackPresets.ts`
2. Add a new entry to the `themePackPresets` array:

```typescript
{
  id: "my-custom-pack",
  name: "My Custom Pack",
  description: "A brief description of the visual identity",
  themeTokens: {
    "--theme-bg": "#0a0a0a",
    "--theme-bg-card": "#141414",
    "--theme-bg-elevated": "#1e1e1e",
    "--theme-text": "#f5f5f5",
    "--theme-text-muted": "#888888",
    "--theme-primary": "#3b82f6",
    "--theme-primary-hover": "#2563eb",
    "--theme-primary-muted": "rgba(59,130,246,0.12)",
    "--theme-accent": "#6366f1",
    "--theme-border": "#2a2a2a",
    "--theme-success": "#10b981",
    "--theme-error": "#ef4444",
    "--theme-warning": "#f59e0b",
    "--theme-radius": "0.5rem",
    "--theme-font": "'Inter', sans-serif",
  },
  componentVariants: {
    button: "rounded",   // Options: rounded, pill, square, soft
    card: "elevated",    // Options: flat, elevated, outlined
    hero: "full-bleed",  // Options: full-bleed, contained, split
    section: "spacious", // Options: spacious, compact, divided
    divider: "subtle",   // Options: subtle, bold, centered, dashed
    productCard: "standard", // Options: standard, minimal, bordered
  },
  blockStyleDefaults: {
    hero: {
      defaultAlign: "center",
      defaultHeight: "default",
      fullWidth: true,
    },
    featureList: {
      columns: 3,
      iconPosition: "top",
      cardStyle: "elevated",
    },
    callToAction: {
      centeredLayout: true,
      showSecondaryButton: true,
      backgroundStyle: "gradient",
    },
  },
}
```

3. The pack automatically appears in the Theme Packs tab — no database migration or API changes needed.

### Guidelines for New Packs

- **Theme tokens:** Include all 15 color variables plus `--theme-radius` and `--theme-font`. Missing variables fall back to the current active theme's values.
- **Component variants:** Choose one variant per component from the available options. See [Component Variants](16-COMPONENT-VARIANTS.md) for the full list.
- **Block style defaults:** Override only the block types where your pack needs a different layout. Unspecified blocks use the global defaults from `shared/blockStyleDefaults.ts`. See [Block Style Defaults](17-BLOCK-STYLE-DEFAULTS.md).
- **Naming:** Use a descriptive `id` with hyphens (e.g., `my-pack-name`). The `name` and `description` appear in the admin UI.

## Source Code

| File | Purpose |
|------|---------|
| `shared/themePackPresets.ts` | Pack definitions (5 presets) |
| `shared/componentVariants.ts` | Component variant registry and CSS variable resolution |
| `shared/blockStyleDefaults.ts` | Global block defaults and merge logic |
| `client/src/pages/admin-cms-themes.tsx` | Admin UI with preview/activate |
| `client/src/components/ThemeProvider.tsx` | Public page theme application |
| `server/src/routes/admin/cms.router.ts` | API endpoints for pack management |
