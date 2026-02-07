# Customer Profile

## Module Info

| Property | Value |
|----------|-------|
| Domain | customer-profile |
| Source Files | server/src/routes/customer/profile.routes.ts |
| Endpoint Count | 6 |
| Mount Point | `/api/customer` |
| Auth Middleware | `isAuthenticated` (customer session) |

## Notes

Customer-facing profile, order history, account linking, and password management.
Rate limiter applied on password change endpoint.

<!-- === AUTO-GENERATED SECTION (do not edit below this line) === -->

## Endpoints

| Method | Path | Handler | Line |
|--------|------|---------|------|
| `GET` | `/api/customer/orders` | List customer order history | 7 |
| `GET` | `/api/customer/orders/:id` | Get order detail | 31 |
| `POST` | `/api/customer/link` | Link account (social auth) | 52 |
| `GET` | `/api/customer/profile` | Get customer profile | 109 |
| `PATCH` | `/api/customer/profile` | Update customer profile | 125 |
| `POST` | `/api/customer/change-password` | Change password (rate limited) | 173 |

_6 endpoint(s) detected._

<!-- === END AUTO-GENERATED SECTION === -->
