# TypeScript Check Baseline

**Date:** February 10, 2026
**Status:** PASS (0 errors)
**Command:** `npm run check` (runs `tsc --noEmit`)

## Configuration

- **Target:** ES2020 (upgraded from unset/default)
- **Module:** ESNext
- **Strict:** true
- **skipLibCheck:** true

## Issues Resolved

### 1. tsconfig target (TS2802)
Set iteration errors (`Type 'Set<string>' can only be iterated...`) across multiple files.
**Fix:** Added `"target": "ES2020"` to tsconfig.json.
**Files affected:** admin-cms-menus.tsx, affiliates.routes.ts, orders.routes.ts, docs-generator.service.ts

### 2. drizzle-zod / Zod 3.25 type incompatibility (TS2344, TS2322)
76 `createInsertSchema` calls produced `ZodObject does not satisfy ZodType<any, any, any>` errors due to Zod 3.25 "mini" rewrite changing the internal type hierarchy.
**Fix:** Added `shared/drizzle-zod-patch.d.ts` module augmentation that widens the `createInsertSchema` return type.
**Note:** Remove patch file when drizzle-zod ships a compatible release.

### 3. Icon typing (TS2769)
`getIconWithFallback` return type was `React.ComponentType<{ className?: string }>`, too narrow for Lucide icon SVG props.
**Fix:** Updated to `React.ComponentType<React.SVGProps<SVGSVGElement> & { className?: string }>`.
**Files affected:** iconUtils.ts, FeatureListBlock.tsx, TrustBarBlock.tsx (and other CMS blocks)

### 4. Auth hook contract (TS2339)
SiteLayout destructured `loading` from `useCustomerAuth()` but the hook exports `isLoading`.
**Fix:** Updated SiteLayout to use `isLoading`.

### 5. Checkout cart reference (TS2304, TS7006)
`CheckoutForm` component referenced `cart` variable not in scope. The parent `CheckoutPage` has `cart` but didn't pass it as a prop.
**Fix:** Added `cart: CartItem[]` to `CheckoutFormProps` and passed it from the parent.

### 6. OpenAI service missing method (TS2339)
`operations.routes.ts` called `openai.generateText()` which didn't exist on `OpenAIService`.
**Fix:** Added `generateText(prompt, options?)` method to OpenAIService with configurable system prompt, model, temperature, and max tokens. Added null check in caller.

### 7. Affiliate payout audit (TS2304)
`userId` variable undefined in affiliate-portal.routes.ts payout request handler.
**Fix:** Replaced with `customer.id` from the resolved identity.

### 8. RichTextEditor setContent (TS2559)
`editor.commands.setContent(value, false)` - second parameter `false` doesn't match `SetContentOptions` type in newer tiptap.
**Fix:** Changed to `setContent(value, { emitUpdate: false })`.

### 9. admin-cms-menus.tsx null check (TS18047)
`over` is possibly null in drag-end handler after guard already checked for it.
**Fix:** Added non-null assertion in nested function where `over` is guaranteed non-null by outer guard.
