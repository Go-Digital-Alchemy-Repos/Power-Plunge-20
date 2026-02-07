# Admin Operations

## Module Info

| Property | Value |
|----------|-------|
| Domain | admin-operations |
| Source Files | server/src/routes/admin/operations.routes.ts |
| Endpoint Count | 14 |
| Mount Points | `/api/admin` (main), `/api/admin/dashboard` (dashboard), `/api/admin/orders` (refunds) |
| Auth Middleware | `requireFullAccess` (main + dashboard); `requireAdmin` (refunds) |

## Multi-Router Exports

This file exports three routers:
- `default` — Seed, AI, email, inventory, audit, jobs — mounted at `/api/admin` with `requireFullAccess`
- `dashboardRoutes` — Dashboard stats — mounted at `/api/admin/dashboard` with `requireFullAccess`
- `refundOrderRoutes` — Order refund creation — mounted at `/api/admin/orders` with `requireAdmin`

## Notes

Consolidates miscellaneous admin operational endpoints: dev seed data, AI content generation, email template/event management, refund management, inventory tracking, audit logs, and background job monitoring.

<!-- === AUTO-GENERATED SECTION (do not edit below this line) === -->

## Endpoints

### Main Operations (requireFullAccess)
| Method | Path | Handler | Line |
|--------|------|---------|------|
| `POST` | `/api/admin/seed` | Seed development data | 8 |
| `POST` | `/api/admin/ai/generate-content` | Generate AI content (OpenAI) | 21 |
| `GET` | `/api/admin/email-events` | List email events | 64 |
| `GET` | `/api/admin/refunds` | List refunds | 77 |
| `PATCH` | `/api/admin/refunds/:id` | Update refund status | 86 |
| `GET` | `/api/admin/email-templates` | List email templates | 114 |
| `POST` | `/api/admin/email-templates` | Create email template | 123 |
| `PATCH` | `/api/admin/email-templates/:id` | Update email template | 132 |
| `GET` | `/api/admin/inventory` | List inventory | 146 |
| `GET` | `/api/admin/inventory/:productId` | Get product inventory | 155 |
| `PATCH` | `/api/admin/inventory/:productId` | Update stock level | 164 |
| `GET` | `/api/admin/audit-logs` | List audit logs | 183 |
| `GET` | `/api/admin/jobs/status` | Background job statuses | 195 |
| `POST` | `/api/admin/jobs/:jobName/run` | Manually trigger a job | 205 |

### Dashboard (requireFullAccess)
| Method | Path | Handler |
|--------|------|---------|
| `GET` | `/api/admin/dashboard` | Dashboard statistics |

### Order Refunds (requireAdmin)
| Method | Path | Handler |
|--------|------|---------|
| `POST` | `/api/admin/orders/:id/refund` | Create refund for order |

_~16 endpoint(s) detected._

<!-- === END AUTO-GENERATED SECTION === -->
