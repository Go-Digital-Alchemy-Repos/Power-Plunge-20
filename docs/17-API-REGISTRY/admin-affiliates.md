# Admin Affiliates

## Module Info

| Property | Value |
|----------|-------|
| Domain | admin-affiliates |
| Source Files | server/src/routes/admin/affiliates.routes.ts |
| Endpoint Count | 13 |
| Mount Point | `/api/admin` |
| Auth Middleware | `requireFullAccess` (blocks fulfillment role) |

## Notes

Admin management for the affiliate program. Covers affiliate settings, affiliate list with analytics, invite management (with Mailgun email delivery), payout processing, and individual affiliate updates.
Helper function `generateAffiliateCode()` was relocated here from the legacy routes.ts during extraction.

<!-- === AUTO-GENERATED SECTION (do not edit below this line) === -->

## Endpoints

| Method | Path | Handler | Line |
|--------|------|---------|------|
| `GET` | `/api/admin/affiliate-settings` | Get affiliate program settings | 70 |
| `PATCH` | `/api/admin/affiliate-settings` | Update affiliate settings | 88 |
| `GET` | `/api/admin/affiliates` | List affiliates with analytics | 97 |
| `GET` | `/api/admin/affiliates/:id` | Get affiliate detail | 115 |
| `PATCH` | `/api/admin/affiliates/:id` | Update affiliate record | 133 |
| `GET` | `/api/admin/affiliate-invites` | List affiliate invites | 162 |
| `POST` | `/api/admin/affiliate-invites` | Create invite code | 205 |
| `DELETE` | `/api/admin/affiliate-invites/:id` | Delete invite | 242 |
| `POST` | `/api/admin/affiliate-invites/send` | Send invite email (Mailgun) | 270 |
| `GET` | `/api/admin/payouts` | List payout records | 378 |
| `PATCH` | `/api/admin/payouts/:id` | Approve/reject payout | 413 |
| `POST` | `/api/admin/affiliate-payouts/run` | Run batch payout processing | 461 |
| `GET` | `/api/admin/affiliate-payouts/batches/:batchId` | Get payout batch detail | 495 |

_13 endpoint(s) detected._

<!-- === END AUTO-GENERATED SECTION === -->
