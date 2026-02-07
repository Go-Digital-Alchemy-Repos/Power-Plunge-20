# Admin Reports

## Module Info

| Property | Value |
|----------|-------|
| Domain | admin-reports |
| Source Files | server/src/routes/admin/reports.routes.ts |
| Endpoint Count | 4 |
| Mount Point | `/api/admin/reports` |
| Auth Middleware | `requireFullAccess` (blocks fulfillment role) |

## Notes

Sales, products, and customer analytics reports with CSV export capability.
Reports support date range filtering via `startDate` and `endDate` query parameters.

<!-- === AUTO-GENERATED SECTION (do not edit below this line) === -->

## Endpoints

| Method | Path | Handler | Line |
|--------|------|---------|------|
| `GET` | `/api/admin/reports/sales` | Sales analytics report | — |
| `GET` | `/api/admin/reports/products` | Product performance report | — |
| `GET` | `/api/admin/reports/customers` | Customer analytics report | — |
| `GET` | `/api/admin/reports/export/csv` | CSV export of report data | — |

_4 endpoint(s) detected._

<!-- === END AUTO-GENERATED SECTION === -->
