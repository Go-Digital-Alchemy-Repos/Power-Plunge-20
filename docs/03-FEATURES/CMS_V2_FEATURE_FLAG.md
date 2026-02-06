# CMS v2 Feature Flag

## Overview
- CMS v2 is an upcoming next-generation content management system, currently behind a feature flag.
- When `CMS_V2_ENABLED=true`, a "CMS v2 (Preview)" nav item appears in the admin CMS dropdown menu, linking to a placeholder page at `/admin/cms-v2`.
- CMS v2 is **additive only** — no existing CMS features are modified or removed when enabled.
- **Rollback procedure:** Set `CMS_V2_ENABLED=false` (or remove it) and restart the application. All legacy CMS functionality continues without interruption.

## Architecture
- **Feature flag:** Environment variable `CMS_V2_ENABLED` (default: `false`).
- **Server helper:** `isCmsV2Enabled()` in `server/src/config/env.ts` returns a boolean.
- **Health endpoint:** `GET /api/health/config` returns `{ cmsV2Enabled: boolean }` — no auth required, used by the frontend to conditionally render the nav item.
- **Frontend:** `AdminNav.tsx` fetches `/api/health/config` via React Query (60s stale time) and conditionally renders the CMS v2 dropdown item.
- **Page:** `client/src/pages/admin-cms-v2.tsx` — placeholder page showing status message.

### Data Flow
1. Server reads `process.env.CMS_V2_ENABLED` on each request to `/api/health/config`.
2. `AdminNav` fetches the config on mount (cached for 60s).
3. If `cmsV2Enabled` is true, the CMS dropdown shows "CMS v2 (Preview)" with a separator.
4. Clicking navigates to `/admin/cms-v2` which renders the placeholder page.

### Key Files
| File | Purpose |
|------|---------|
| `server/src/config/env.ts` | `isCmsV2Enabled()` helper |
| `server/routes.ts` | `GET /api/health/config` endpoint |
| `client/src/components/admin/AdminNav.tsx` | Conditional nav item rendering |
| `client/src/pages/admin-cms-v2.tsx` | Placeholder page |
| `client/src/App.tsx` | Route registration |

## Database
- No database changes. CMS v2 feature flag is purely environment-based.

## APIs

### GET /api/health/config
- **Auth:** None required (public endpoint).
- **Request:** No parameters.
- **Response:**
```json
{
  "cmsV2Enabled": false
}
```
- **Error cases:** None (always returns 200).

## Frontend Integration
- **Route:** `/admin/cms-v2` registered in `App.tsx`.
- **Nav item:** Appears in CMS dropdown below a separator, only when `healthConfig.cmsV2Enabled` is true.
- **Page:** Shows "CMS v2 Preview — legacy CMS remains active." with rollback instructions.
- **data-testid attributes:**
  - `link-cms-v2` — Nav link
  - `admin-cms-v2-page` — Page container
  - `badge-preview` — Preview badge
  - `card-cms-v2-status` — Status card
  - `text-cms-v2-message` — Status message

## Security Considerations
- `/api/health/config` is intentionally public — it only exposes feature flag status, no sensitive data.
- The CMS v2 page itself is protected by `useAdmin()` hook (requires admin/store_manager role).

## Operational Notes
- **Enabling:** Set `CMS_V2_ENABLED=true` in environment variables, restart the application.
- **Disabling:** Set `CMS_V2_ENABLED=false` or remove the variable, restart the application.
- **No data impact:** Toggling the flag has zero effect on existing CMS pages, content, or settings.
- **Config caching:** The frontend caches the config for 60 seconds. After changing the flag and restarting, admins may need to wait up to 60s or refresh the page.

## Related Docs
- Docs Governance System (`docs/03-FEATURES/DOCS_GOVERNANCE_SYSTEM.md`)
- CMS Page Builder (`replit.md` — CMS Page Builder section)
