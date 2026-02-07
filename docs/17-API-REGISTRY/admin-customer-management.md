# Admin Customer Management

## Module Info

| Property | Value |
|----------|-------|
| Domain | admin-customer-management |
| Source Files | server/src/routes/admin/customer-management.routes.ts |
| Endpoint Count | 13 |
| Mount Point | `/api/admin/customers` |
| Auth Middleware | `requireFullAccess` (blocks fulfillment role) |

## Notes

Deep customer profile management for admins. Provides notes, tags, order history, audit logs, and account actions (disable, enable, force-logout, password reset).
This is separate from the basic customer CRUD in `customers.routes.ts`.

<!-- === AUTO-GENERATED SECTION (do not edit below this line) === -->

## Endpoints

| Method | Path | Handler | Line |
|--------|------|---------|------|
| `GET` | `/api/admin/customers/:customerId/notes` | List customer notes | 7 |
| `POST` | `/api/admin/customers/:customerId/notes` | Add customer note | 16 |
| `DELETE` | `/api/admin/customers/:customerId/notes/:noteId` | Delete customer note | 30 |
| `GET` | `/api/admin/customers/:customerId/profile` | Get customer profile | 39 |
| `GET` | `/api/admin/customers/:customerId/tags` | List customer tags | 51 |
| `PUT` | `/api/admin/customers/:customerId/tags` | Update customer tags | 60 |
| `GET` | `/api/admin/customers/:customerId/orders` | List customer orders | 84 |
| `GET` | `/api/admin/customers/:customerId/audit-logs` | Customer audit logs | 97 |
| `POST` | `/api/admin/customers/:customerId/disable` | Disable customer account | 106 |
| `POST` | `/api/admin/customers/:customerId/enable` | Enable customer account | 133 |
| `POST` | `/api/admin/customers/:customerId/send-password-reset` | Send password reset email | 160 |
| `POST` | `/api/admin/customers/:customerId/reset-password` | Admin-initiated password reset | 184 |
| `POST` | `/api/admin/customers/:customerId/force-logout` | Force customer logout | 220 |

_13 endpoint(s) detected._

<!-- === END AUTO-GENERATED SECTION === -->
