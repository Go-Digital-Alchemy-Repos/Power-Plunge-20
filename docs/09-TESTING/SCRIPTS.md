# Scripts Reference

All scripts are located in the `scripts/` directory and run with `npx tsx`. They connect to the live PostgreSQL database and perform read-only checks unless otherwise noted.

## Overview

| Script | Path | Purpose | Destructive |
|--------|------|---------|-------------|
| Doctor | `scripts/doctor.ts` | Environment health check | No |
| Verify Schema | `scripts/db/verifySchema.ts` | Database table verification | No |
| CMS Parity Check | `scripts/cmsParityCheck.ts` | Legacy vs CMS v2 data consistency | No |
| Content Safety | `scripts/smoke/cmsContentSafety.ts` | Content validation regression tests | No |
| Seed Email Templates | `scripts/seed-email-templates.ts` | Seed default email templates | Idempotent writes |

## scripts/doctor.ts

Environment validation script that checks whether the application is correctly configured.

**Run:**
```bash
npx tsx scripts/doctor.ts
```

**Checks performed:**
1. Required environment variables (`DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`)
2. Optional environment variables with warnings (`SENDGRID_API_KEY`, `CMS_V2_ENABLED`, etc.)
3. Database connection (attempts a simple query)
4. Integration configuration status (Stripe, Mailgun, Replit Auth)

**Output format:**
```
[checkmark] Environment: DATABASE_URL is set
[warning] Environment: SENDGRID_API_KEY is not set
  -> Set SENDGRID_API_KEY to enable email notifications
[checkmark] Database: Connection successful
```

Exit code: `0` if all required checks pass, `1` if any required check fails.

## scripts/db/verifySchema.ts

Verifies that all 65 expected database tables exist in PostgreSQL and checks key data invariants.

**Run:**
```bash
npx tsx scripts/db/verifySchema.ts
```

**Checks performed:**
1. Queries `information_schema.tables` for all public tables
2. Compares against a hardcoded list of 65 expected table names
3. Reports missing tables and unexpected extra tables
4. Checks data invariants:
   - At most one page has `is_home = true`
   - At most one page has `is_shop = true`

**Expected output:**
```
[checkmark] All 65 expected tables exist
[info] 6 extra tables found (Better Auth managed separately)
[checkmark] Home page uniqueness: OK
[checkmark] Shop page uniqueness: OK
```

Exit code: `0` if all tables exist and invariants hold, `1` otherwise.

## scripts/cmsParityCheck.ts

Compares data between the legacy CMS storage layer and the CMS v2 repository to verify consistency.

**Run:**
```bash
npx tsx scripts/cmsParityCheck.ts
```

**Checks performed:**
1. **List parity:** Compares page lists from both APIs (count and field-level match)
2. **Home page parity:** Verifies both APIs return the same home page
3. **Shop page parity:** Verifies both APIs return the same shop page
4. **Individual page parity:** Deep-compares each page across 26 fields

**Fields compared:**
```
id, title, slug, content, contentJson, pageType, isHome, isShop,
template, metaTitle, metaDescription, metaKeywords, canonicalUrl,
ogTitle, ogDescription, ogImage, twitterCard, twitterTitle,
twitterDescription, twitterImage, robots, featuredImage, status,
showInNav, navOrder, createdAt, updatedAt
```

**Output format:**
```
=== CMS Parity Check ===
PASS  List count matches (3 pages)
PASS  Home page matches
PASS  Shop page matches
PASS  Page "about" fields match
FAIL  Page "faq" field diff: metaDescription
```

Exit code: `0` if all checks pass, `1` if any field differs.

## scripts/smoke/cmsContentSafety.ts

Regression test suite for the content validation and HTML sanitization functions.

**Run:**
```bash
npx tsx scripts/smoke/cmsContentSafety.ts
```

**Does not require a running server or database.** Imports functions directly from `server/src/utils/contentValidation.ts`.

**Test categories:**

### contentJson Validation (13 assertions)

| Test | Expected |
|------|----------|
| `null` contentJson | Valid (empty blocks) |
| Empty blocks array | Valid |
| String input | Rejected |
| Array input | Rejected |
| Missing `blocks` key | Rejected |
| Valid block | Accepted |
| Empty block `id` | Rejected |
| Empty block `type` | Rejected |
| Non-object `data` | Rejected |
| Unknown block type | Accepted with warning |
| Warning text includes type name | Yes |
| Mixed known + unknown blocks | Accepted |
| Only unknown blocks produce warnings | Yes |

### HTML Sanitization (8 assertions)

| Test | Expected |
|------|----------|
| Script tags removed | `<script>` stripped |
| Safe content preserved | Non-script HTML intact |
| Event handlers removed | `onclick`, `onmouseover` stripped |
| Element preserved after handler removal | Tag structure intact |
| `javascript:` URI neutralized | Replaced with `#` |
| Link element preserved | `<a>` tag intact |
| Safe HTML unchanged | Clean HTML passes through |
| Multiple script tags removed | All `<script>` blocks stripped |

**Output:**
```
=== contentJson Validation ===
PASS  null contentJson is valid (becomes empty blocks)
...
=== HTML Sanitization ===
PASS  script tags removed
...
=== Results: 21 passed, 0 failed ===
```

Exit code: `0` if all 21 assertions pass, `1` otherwise.

## scripts/seed-email-templates.ts

Seeds default email templates into the `email_templates` database table.

**Run:**
```bash
npx tsx scripts/seed-email-templates.ts
```

**Behavior:**
- Iterates through a predefined list of default templates (abandoned cart, order confirmation, etc.)
- For each template, checks if one with the same `key` already exists
- Only inserts templates that do not already exist (idempotent)
- Logs each template as "created" or "already exists"

**Templates seeded:**
- `ABANDONED_CART` — Abandoned cart reminder
- `ORDER_CONFIRMATION` — Order confirmation
- `SHIPPING_NOTIFICATION` — Shipping update
- `AFFILIATE_WELCOME` — Affiliate welcome email
- `AFFILIATE_PAYOUT` — Payout notification
- `RECOVERY_REMINDER` — Cart recovery follow-up

## Running All Checks

To run all non-destructive verification scripts:

```bash
npx tsx scripts/doctor.ts && \
npx tsx scripts/db/verifySchema.ts && \
npx tsx scripts/cmsParityCheck.ts && \
npx tsx scripts/smoke/cmsContentSafety.ts
```

All four scripts exit with code `0` on success and `1` on failure, so they can be chained with `&&` for a full health check.
