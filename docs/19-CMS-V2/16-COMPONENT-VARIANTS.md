# Component Variants

Component variants control the shape, spacing, and visual weight of UI components across the storefront. Each component has a set of named variants that resolve to `--cv-*` CSS custom properties applied globally.

## Architecture

```
shared/componentVariants.ts    → Variant registry, resolution functions, Zod schemas
client/src/pages/admin-cms-v2-themes.tsx → Admin UI (applied via theme packs)
client/src/components/ThemeProvider.tsx  → Public page variant application
```

### Data Flow

1. A theme pack defines a `componentVariants` selection (e.g., `{ button: "pill", card: "outlined" }`)
2. `resolveAllVariantStyles(selection)` converts selections into a flat CSS variable map (26 variables)
3. Variables are applied to `document.documentElement` alongside theme tokens
4. Components read from `var(--cv-button-radius)`, `var(--cv-card-shadow)`, etc.

## Component Registry (6 Components)

| Component | Label | Description | Default Variant | Available Variants |
|-----------|-------|-------------|-----------------|-------------------|
| `button` | Button | Primary action buttons, CTAs, and interactive controls | `rounded` | rounded, pill, square, soft |
| `card` | Card | Content cards, product cards, and information panels | `elevated` | flat, elevated, outlined |
| `hero` | Hero | Hero banners and full-width header sections | `full-bleed` | full-bleed, contained, split |
| `section` | Section | Content sections and page layout blocks | `spacious` | spacious, compact, divided |
| `divider` | Divider | Horizontal rules and section separators | `subtle` | subtle, bold, centered, dashed |
| `productCard` | Product Card | Product display cards in grids and listings | `standard` | standard, minimal, bordered |

## Variant Details

### Button Variants

| Variant | Radius | Padding | Font Weight | Shadow |
|---------|--------|---------|-------------|--------|
| `rounded` | `var(--theme-radius, 0.5rem)` | `0.625rem 1.5rem` | 600 | none |
| `pill` | `9999px` | `0.625rem 2rem` | 600 | none |
| `square` | `0` | `0.75rem 1.5rem` | 700 | none |
| `soft` | `0.375rem` | `0.625rem 1.5rem` | 500 | `0 1px 3px rgba(0,0,0,0.2)` |

CSS variables generated: `--cv-button-radius`, `--cv-button-padding`, `--cv-button-font-weight`, `--cv-button-shadow`

### Card Variants

| Variant | Background | Border | Shadow | Radius |
|---------|-----------|--------|--------|--------|
| `flat` | `var(--theme-bg-card, #111827)` | none | none | `var(--theme-radius, 0.5rem)` |
| `elevated` | `var(--theme-bg-card, #111827)` | none | `0 4px 12px rgba(0,0,0,0.25)` | `var(--theme-radius, 0.5rem)` |
| `outlined` | `var(--theme-bg-card, #111827)` | `1px solid var(--theme-border, #374151)` | none | `var(--theme-radius, 0.5rem)` |

CSS variables generated: `--cv-card-radius`, `--cv-card-border`, `--cv-card-shadow`, `--cv-card-bg`

### Hero Variants

| Variant | Padding | Max Width | Radius | Text Align |
|---------|---------|-----------|--------|------------|
| `full-bleed` | `4rem 0` | `100%` | `0` | `center` |
| `contained` | `3rem 2rem` | `72rem` | `var(--theme-radius, 0.5rem)` | `center` |
| `split` | `4rem 2rem` | `100%` | `0` | `left` |

CSS variables generated: `--cv-hero-padding`, `--cv-hero-max-width`, `--cv-hero-radius`, `--cv-hero-text-align`

### Section Variants

| Variant | Padding | Gap | Max Width | Border Bottom |
|---------|---------|-----|-----------|---------------|
| `spacious` | `4rem 2rem` | `2rem` | `72rem` | none |
| `compact` | `2rem 1.5rem` | `1rem` | `72rem` | none |
| `divided` | `3.5rem 2rem` | `1.5rem` | `72rem` | `1px solid var(--theme-border, #374151)` |

CSS variables generated: `--cv-section-padding`, `--cv-section-gap`, `--cv-section-max-width`, `--cv-section-border-bottom`

### Divider Variants

| Variant | Height | Color | Width | Margin | Style |
|---------|--------|-------|-------|--------|-------|
| `subtle` | `1px` | `var(--theme-border, #374151)` | `100%` | `2rem 0` | solid |
| `bold` | `2px` | `var(--theme-primary, #67e8f9)` | `100%` | `2.5rem 0` | solid |
| `centered` | `2px` | `var(--theme-primary-muted, rgba(103,232,249,0.15))` | `4rem` | `2rem auto` | solid |
| `dashed` | `1px` | `var(--theme-border, #374151)` | `100%` | `2rem 0` | dashed |

CSS variables generated: `--cv-divider-height`, `--cv-divider-color`, `--cv-divider-width`, `--cv-divider-margin`, `--cv-divider-style`

### Product Card Variants

| Variant | Radius | Shadow | Border | Image Ratio | Padding |
|---------|--------|--------|--------|-------------|---------|
| `standard` | `var(--theme-radius, 0.5rem)` | `0 4px 12px rgba(0,0,0,0.25)` | none | `4/3` | `1rem` |
| `minimal` | `0.25rem` | none | none | `1/1` | `0.75rem` |
| `bordered` | `var(--theme-radius, 0.5rem)` | none | `1px solid var(--theme-border, #374151)` | `4/3` | `1rem` |

CSS variables generated: `--cv-product-card-radius`, `--cv-product-card-shadow`, `--cv-product-card-border`, `--cv-product-card-img-ratio`, `--cv-product-card-padding`

## CSS Variable Naming Convention

All component variant CSS variables follow the pattern:

```
--cv-{component}-{property}
```

Examples: `--cv-button-radius`, `--cv-card-shadow`, `--cv-hero-padding`

The `--cv-` prefix distinguishes component variant variables from theme token variables (`--theme-*`).

## Resolution Functions

### `resolveAllVariantStyles(selection)`

Takes a `ComponentVariantSelection` object and returns a flat `Record<string, string>` of all 26 CSS custom properties.

```typescript
const selection = { button: "pill", card: "elevated", hero: "contained", ... };
const cssVars = resolveAllVariantStyles(selection);
// Returns: { "--cv-button-radius": "9999px", "--cv-card-shadow": "0 4px 12px ...", ... }
```

### `getDefaultSelection()`

Returns the default variant selection for all components:

```typescript
{ button: "rounded", card: "elevated", hero: "full-bleed",
  section: "spacious", divider: "subtle", productCard: "standard" }
```

### `getVariantDef(component)`

Returns the full variant definition for a single component, including all available variants and their CSS variable mappings.

### `resolveVariantStyles(component, variantId)`

Resolves a single component's variant to its CSS variables.

## Integration with Theme Packs

Theme packs include a `componentVariants` field that maps each component to its variant choice. When a pack is previewed or activated, the pack's variant selection is resolved and applied alongside its theme tokens. See [Theme Packs](15-THEME-PACKS.md).

When no theme pack is active, the default variant selection is used (`getDefaultSelection()`).

## Source Code

| File | Purpose |
|------|---------|
| `shared/componentVariants.ts` | Variant registry, resolution functions, Zod schemas |
| `shared/themePackPresets.ts` | Theme packs referencing variant selections |
| `client/src/pages/admin-cms-v2-themes.tsx` | Admin preview/activate UI |
