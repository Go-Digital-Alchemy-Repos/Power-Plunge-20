# Affiliate Management

## Module Info

| Property | Value |
|----------|-------|
| Domain | affiliates |
| Source Files | `server/src/routes/admin/affiliates-v2.routes.ts` (canonical), `server/src/routes/affiliate.routes.ts` (re-export shim) |
| Mount Point | `/api/admin/affiliates-v2` |
| Endpoint Count | 18 |

## Auth & Authorization

| Property | Value |
|----------|-------|
| Auth Required | Yes |
| Roles Allowed | Admin (full access only — `requireFullAccess` middleware applied at mount) |

## Current reality

- **Canonical source:** `server/src/routes/admin/affiliates-v2.routes.ts`
- **Re-export shim:** `server/src/routes/affiliate.routes.ts` re-exports the default from `admin/affiliates-v2.routes.ts`.
- **Effective base mount:** `/api/admin/affiliates-v2` (see `server/routes.ts` line 93).
- **Paths in the corrected table in the Notes section are fully qualified** (mount prefix + router path). The auto-generated table further below has incorrect paths — see the correction notice in Notes.

## How these modules relate

There are **two** admin-facing affiliate route files:

| File | Mount Point | Responsibility |
|------|-------------|----------------|
| `admin/affiliates.routes.ts` | `/api/admin` | Program settings (`/affiliate-settings`), affiliate CRUD (`/affiliates`, `/affiliates/:id`), invite management (`/affiliate-invites`), legacy payout operations (`/payouts`, `/affiliate-payouts/run`, `/affiliate-payouts/batches/:batchId`) |
| `admin/affiliates-v2.routes.ts` | `/api/admin/affiliates-v2` | Commission review workflows (flagged queue, approve, void, review-approve, review-void, bulk-approve, auto-approve), affiliate profile/commissions/referred-customers, leaderboard, structured payout lifecycle (approve → reject → process), manual payout recording, payout batch execution, affiliate deletion |

Both modules require `requireFullAccess` at mount. They coexist because the v1 module handles program configuration and invite workflows, while the v2 module handles the commission-review and payout-processing pipelines added later.

## Notes

> **Path correction notice:** The auto-generated endpoint table below was generated with an incorrect mount prefix (`/api/admin/` instead of `/api/admin/affiliates-v2/`). The corrected fully-qualified paths are listed here for reference until the table is regenerated.

| Method | Effective URL |
|--------|---------------|
| `GET` | `/api/admin/affiliates-v2/leaderboard` |
| `GET` | `/api/admin/affiliates-v2/:affiliateId/profile` |
| `GET` | `/api/admin/affiliates-v2/:affiliateId/commissions` |
| `GET` | `/api/admin/affiliates-v2/:affiliateId/referred-customers` |
| `POST` | `/api/admin/affiliates-v2/commissions/:commissionId/approve` |
| `POST` | `/api/admin/affiliates-v2/commissions/:commissionId/void` |
| `GET` | `/api/admin/affiliates-v2/commissions/flagged` |
| `POST` | `/api/admin/affiliates-v2/commissions/:commissionId/review-approve` |
| `POST` | `/api/admin/affiliates-v2/commissions/:commissionId/review-void` |
| `POST` | `/api/admin/affiliates-v2/commissions/bulk-approve` |
| `POST` | `/api/admin/affiliates-v2/commissions/auto-approve` |
| `POST` | `/api/admin/affiliates-v2/payouts/:payoutId/approve` |
| `POST` | `/api/admin/affiliates-v2/payouts/:payoutId/reject` |
| `POST` | `/api/admin/affiliates-v2/payouts/:payoutId/process` |
| `POST` | `/api/admin/affiliates-v2/:affiliateId/payouts` |
| `GET` | `/api/admin/affiliates-v2/:affiliateId/payouts` |
| `POST` | `/api/admin/affiliates-v2/run-payout-batch` |
| `DELETE` | `/api/admin/affiliates-v2/:affiliateId` |


<!-- === AUTO-GENERATED SECTION (do not edit below this line) === -->

## Endpoints

| Method | Path | Source File | Line |
|--------|------|-------------|------|
| `DELETE` | `/api/admin/:affiliateId` | server/src/routes/affiliate.routes.ts | 691 |
| `GET` | `/api/admin/:affiliateId/commissions` | server/src/routes/affiliate.routes.ts | 143 |
| `GET` | `/api/admin/:affiliateId/payouts` | server/src/routes/affiliate.routes.ts | 651 |
| `POST` | `/api/admin/:affiliateId/payouts` | server/src/routes/affiliate.routes.ts | 560 |
| `GET` | `/api/admin/:affiliateId/profile` | server/src/routes/affiliate.routes.ts | 90 |
| `GET` | `/api/admin/:affiliateId/referred-customers` | server/src/routes/affiliate.routes.ts | 155 |
| `POST` | `/api/admin/commissions/:commissionId/approve` | server/src/routes/affiliate.routes.ts | 167 |
| `POST` | `/api/admin/commissions/:commissionId/review-approve` | server/src/routes/affiliate.routes.ts | 244 |
| `POST` | `/api/admin/commissions/:commissionId/review-void` | server/src/routes/affiliate.routes.ts | 277 |
| `POST` | `/api/admin/commissions/:commissionId/void` | server/src/routes/affiliate.routes.ts | 199 |
| `POST` | `/api/admin/commissions/auto-approve` | server/src/routes/affiliate.routes.ts | 343 |
| `POST` | `/api/admin/commissions/bulk-approve` | server/src/routes/affiliate.routes.ts | 310 |
| `GET` | `/api/admin/commissions/flagged` | server/src/routes/affiliate.routes.ts | 233 |
| `GET` | `/api/admin/leaderboard` | server/src/routes/affiliate.routes.ts | 78 |
| `POST` | `/api/admin/payouts/:payoutId/approve` | server/src/routes/affiliate.routes.ts | 382 |
| `POST` | `/api/admin/payouts/:payoutId/process` | server/src/routes/affiliate.routes.ts | 461 |
| `POST` | `/api/admin/payouts/:payoutId/reject` | server/src/routes/affiliate.routes.ts | 420 |
| `POST` | `/api/admin/run-payout-batch` | server/src/routes/affiliate.routes.ts | 669 |

_18 endpoint(s) detected._

<!-- === END AUTO-GENERATED SECTION === -->
