# Affiliate Tracking

## Module Info

| Property | Value |
|----------|-------|
| Domain | affiliate-tracking |
| Source Files | `server/src/routes/public/affiliate-tracking.routes.ts` |
| Mount Point | `/api/affiliate` |
| Endpoint Count | 1 |

## Auth & Authorization

| Property | Value |
|----------|-------|
| Auth Required | No (public route; no mount-level middleware) |
| Roles Allowed | Public — rate-limited via `affiliateTrackLimiter` middleware on the route |

## Current reality

- **Canonical source:** `server/src/routes/public/affiliate-tracking.routes.ts`
- **Effective base mount:** `/api/affiliate` (see `server/routes.ts` line 87; no auth middleware at mount).
- **The single endpoint's fully qualified path is `/api/affiliate/track`.**
- **Related public route on the same mount:** The `publicAffiliateRoutes` export from `customer/affiliates.routes.ts` is also mounted at `/api/affiliate` (line 145), adding `GET /api/affiliate/agreement`. That endpoint is documented in this note for completeness but belongs to the customer affiliates module.

## Notes

> **Path correction notice:** The auto-generated table below shows the path as `/api/track` instead of `/api/affiliate/track`. The corrected path is `/api/affiliate/track`.

| Method | Effective URL | Description |
|--------|---------------|-------------|
| `POST` | `/api/affiliate/track` | Record an affiliate click (sets attribution cookie) |

> **Collocated endpoint (different source file, same mount):** `GET /api/affiliate/agreement` — returns the current affiliate agreement text. Source: `server/src/routes/customer/affiliates.routes.ts` (`publicAffiliateRoutes` export), mounted at `/api/affiliate` in `server/routes.ts` line 145. No auth required.


<!-- === AUTO-GENERATED SECTION (do not edit below this line) === -->

## Endpoints

| Method | Path | Source File | Line |
|--------|------|-------------|------|
| `POST` | `/api/track` | server/src/routes/public/affiliate-tracking.routes.ts | 8 |

_1 endpoint(s) detected._

<!-- === END AUTO-GENERATED SECTION === -->
