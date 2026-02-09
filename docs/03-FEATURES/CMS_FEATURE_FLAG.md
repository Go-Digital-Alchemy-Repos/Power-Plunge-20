# CMS Feature Flag (Deprecated)

> **⚠️ DEPRECATED:** The `CMS_V2_ENABLED` / `CMS_ENABLED` feature flag has been removed. CMS is now always active and no longer requires a feature flag to enable. This document is retained for historical reference only.

## Overview
- CMS is the block-based content management system, formerly behind a feature flag (`CMS_V2_ENABLED`).
- The feature flag has been removed — CMS functionality is now always available.
- CMS is **additive only** — no existing CMS features are modified or removed.
- The nav item at `/admin/cms` is always visible to admins.

## Architecture
- **Feature flag:** Environment variable `CMS_ENABLED` (default: `false`).
- **Server helper:** `isCmsEnabled()` in `server/src/config/env.ts` returns a boolean.
- **Health endpoint:** `GET /api/health/config` returns `{ cmsEnabled: boolean }` — no auth required, used by the frontend to conditionally render the nav item.
- **Frontend:** `AdminNav.tsx` fetches `/api/health/config` via React Query (60s stale time) and conditionally renders the CMS dropdown item.
- **Page:** `client/src/pages/admin-cms.tsx` — placeholder page showing status message.

### Data Flow
1. Server reads `process.env.CMS_ENABLED` on each request to `/api/health/config`.
2. `AdminNav` fetches the config on mount (cached for 60s).
3. If `cmsEnabled` is true, the CMS dropdown shows "CMS (Preview)" with a separator.
4. Clicking navigates to `/admin/cms` which renders the placeholder page.

### Key Files
| File | Purpose |
|------|---------|
| `server/src/config/env.ts` | `isCmsEnabled()` helper |
| `server/routes.ts` | `GET /api/health/config` endpoint |
| `client/src/components/admin/AdminNav.tsx` | Conditional nav item rendering |
| `client/src/pages/admin-cms.tsx` | Placeholder page |
| `client/src/App.tsx` | Route registration |

## Database
- No database changes. CMS feature flag is purely environment-based.

## APIs

### GET /api/health/config
- **Auth:** None required (public endpoint).
- **Request:** No parameters.
- **Response:**
```json
{
  "cmsEnabled": false
}
```
- **Error cases:** None (always returns 200).

## Frontend Integration
- **Route:** `/admin/cms` registered in `App.tsx`.
- **Nav item:** Appears in CMS dropdown below a separator, only when `healthConfig.cmsEnabled` is true.
- **Page:** Shows "CMS Preview — legacy CMS remains active." with rollback instructions.
- **data-testid attributes:**
  - `link-cms` — Nav link
  - `admin-cms-page` — Page container
  - `badge-preview` — Preview badge
  - `card-cms-status` — Status card
  - `text-cms-message` — Status message

## Security Considerations
- `/api/health/config` is intentionally public — it only exposes feature flag status, no sensitive data.
- The CMS page itself is protected by `useAdmin()` hook (requires admin/store_manager role).

## Operational Notes
- **Enabling:** Set `CMS_ENABLED=true` in environment variables, restart the application.
- **Disabling:** Set `CMS_ENABLED=false` or remove the variable, restart the application.
- **No data impact:** Toggling the flag has zero effect on existing CMS pages, content, or settings.
- **Config caching:** The frontend caches the config for 60 seconds. After changing the flag and restarting, admins may need to wait up to 60s or refresh the page.

## Related Docs
- Docs Governance System (`docs/03-FEATURES/DOCS_GOVERNANCE_SYSTEM.md`)
- CMS Page Builder (`replit.md` — CMS Page Builder section)
