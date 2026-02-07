# Block Style Defaults

Block style defaults define the initial property values for each block type when rendered on the storefront. They control layout, alignment, visibility of sub-elements, and visual style before any per-block overrides are applied. Theme packs can override these defaults to create cohesive, pack-specific layouts.

## Architecture

```
shared/blockStyleDefaults.ts   → Global defaults, merge logic, Zod schemas
shared/themePackPresets.ts      → Per-pack default overrides
```

### Resolution Order

When rendering a block, defaults are resolved in three layers:

1. **Global defaults** — Base values defined in `BLOCK_STYLE_DEFAULTS` (`shared/blockStyleDefaults.ts`)
2. **Theme pack overrides** — The active pack's `blockStyleDefaults` for that block type (if a pack is active)
3. **Per-block overrides** — Individual block settings stored in the page's `contentJson`

Each layer merges on top of the previous. The merge is shallow — per-block-type, not per-property across block types.

## Supported Block Types (25)

### Core Layout Blocks

| Block Type | Property | Default | Description |
|------------|----------|---------|-------------|
| **hero** | `defaultAlign` | `"center"` | Text alignment: left, center, right |
| | `defaultOverlay` | `"60"` | Background overlay opacity (0–100) |
| | `defaultHeight` | `"default"` | Section height: default, tall, full |
| | `defaultLayout` | `"stacked"` | Layout mode: stacked, split |
| | `fullWidth` | `true` | Edge-to-edge or contained width |
| **featureList** | `cardStyle` | `"elevated"` | Card visual style |
| | `iconPosition` | `"top"` | Icon placement: top, left |
| | `columns` | `3` | Grid column count |
| **callToAction** | `centeredLayout` | `true` | Center-align content |
| | `showSecondaryButton` | `true` | Display secondary button |
| | `backgroundStyle` | `"gradient"` | Background: solid, gradient |
| **richText** | `defaultAlign` | `"left"` | Text alignment |
| | `maxWidth` | `"prose"` | Content width constraint |
| **divider** | `style` | `"subtle"` | Divider visual style |

### Media Blocks

| Block Type | Property | Default | Description |
|------------|----------|---------|-------------|
| **image** | `defaultAspectRatio` | `"16:9"` | Image aspect ratio |
| | `rounded` | `true` | Apply border radius |
| **imageGrid** | `columns` | `3` | Grid column count |
| | `spacing` | `"normal"` | Gap between images |

### E-Commerce Blocks

| Block Type | Property | Default | Description |
|------------|----------|---------|-------------|
| **productGrid** | `columns` | `3` | Product grid columns |
| | `showPrice` | `true` | Display price |
| | `cardStyle` | `"standard"` | Card visual style |
| **productHighlight** | `showGallery` | `true` | Show image gallery |
| | `showBuyButton` | `true` | Display buy button |
| | `layout` | `"split"` | Layout: split, stacked |

### Trust Blocks

| Block Type | Property | Default | Description |
|------------|----------|---------|-------------|
| **testimonials** | `layout` | `"cards"` | Layout style |
| | `showAvatar` | `true` | Display user avatar |
| | `cardStyle` | `"elevated"` | Card visual style |
| **trustBar** | `layout` | `"row"` | Display layout |
| | `iconSize` | `"md"` | Icon size: sm, md, lg |
| **comparisonTable** | `striped` | `true` | Alternating row colors |
| | `highlightWinner` | `true` | Highlight winning column |
| **pressMentions** | `layout` | `"row"` | Display layout |
| | `showLogos` | `true` | Show publication logos |
| | `grayscaleLogos` | `true` | Desaturate logos |
| **socialProofStats** | `layout` | `"row"` | Display layout |
| | `animateNumbers` | `true` | Animate count-up on scroll |

### Domain-Specific Blocks (Power Plunge)

| Block Type | Property | Default | Description |
|------------|----------|---------|-------------|
| **benefitStack** | `layout` | `"stack"` | Display layout |
| | `showIcons` | `true` | Show benefit icons |
| **scienceExplainer** | `showCitations` | `true` | Show research citations |
| | `showDisclaimer` | `true` | Show medical disclaimer |
| **protocolBuilder** | `showDisclaimer` | `true` | Show safety disclaimer |
| | `highlightLevel` | `"intermediate"` | Default highlighted protocol |
| **recoveryUseCases** | `layout` | `"grid"` | Display layout |
| | `showBullets` | `true` | Show bullet points |
| **safetyChecklist** | `showDisclaimer` | `true` | Show medical disclaimer |
| | `groupByRequired` | `true` | Group required vs recommended items |
| **guaranteeAndWarranty** | `layout` | `"cards"` | Display layout |
| | `showIcons` | `true` | Show guarantee icons |
| **deliveryAndSetup** | `showTimeline` | `true` | Show delivery timeline |
| | `showIcons` | `true` | Show step icons |
| **financingAndPayment** | `showCalculator` | `true` | Show payment calculator |
| | `highlightPrimary` | `true` | Highlight primary payment option |
| **objectionBusters** | `layout` | `"accordion"` | Display layout |
| | `showIcons` | `true` | Show objection icons |
| **beforeAfterExpectations** | `layout` | `"columns"` | Display layout |
| | `showTimeline` | `true` | Show experience timeline |
| **faq** | `allowMultipleOpen` | `false` | Allow multiple FAQs open simultaneously |
| | `iconStyle` | `"chevron"` | Toggle icon style |

## Theme Pack Overrides

Each theme pack can override defaults for any subset of block types. Unspecified block types retain the global defaults.

Example from the `spa-minimal` pack:

```typescript
blockStyleDefaults: {
  hero: {
    defaultAlign: "center",
    defaultHeight: "tall",
    fullWidth: false,         // Override: contained hero
  },
  featureList: {
    columns: 2,              // Override: 2-column layout
    iconPosition: "left",    // Override: side-by-side icons
    cardStyle: "flat",       // Override: flat cards
  },
  callToAction: {
    centeredLayout: true,
    showSecondaryButton: false, // Override: single CTA button
    backgroundStyle: "solid",  // Override: no gradient
  },
}
```

Pack overrides for the 5 built-in packs are documented in [Theme Packs](15-THEME-PACKS.md).

## Resolution Functions

### `getBlockDefaults(blockType)`

Returns the global defaults for a single block type. Returns an empty object if the block type has no defaults.

### `resolveBlockDefaults(blockType, themePackOverrides?)`

Merges global defaults with optional theme pack overrides for a single block type. The merge is shallow — pack values replace global values for the same property.

### `resolveAllBlockDefaults(themePackOverrides?)`

Returns the resolved defaults for all block types, merging global defaults with optional theme pack overrides. Block types not present in either source are omitted.

### `getSupportedBlockTypes()`

Returns the list of all block type keys that have global defaults defined.

## Value Types

Block style default values support three types:

| Type | Examples | Use Case |
|------|----------|----------|
| `string` | `"center"`, `"gradient"`, `"elevated"` | Alignment, style variants, layout modes |
| `number` | `3`, `60` | Column counts, opacity values |
| `boolean` | `true`, `false` | Toggle features on/off |

## Source Code

| File | Purpose |
|------|---------|
| `shared/blockStyleDefaults.ts` | Global defaults, merge logic, Zod schemas |
| `shared/themePackPresets.ts` | Per-pack overrides (5 packs) |
| `client/src/pages/admin-cms-v2-themes.tsx` | Admin thumbnail rendering using block defaults |
