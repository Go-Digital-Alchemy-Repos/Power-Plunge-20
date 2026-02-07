# Admin Settings

## Module Info

| Property | Value |
|----------|-------|
| Domain | admin-settings |
| Source Files | server/src/routes/admin/settings.routes.ts |
| Endpoint Count | 9 |
| Mount Point | `/api/admin/settings` |
| Auth Middleware | `requireFullAccess` (blocks fulfillment role) |

## Multi-Router Exports

This file also exports `integrationsStatusRoutes` mounted at `/api/admin/integrations` with `requireFullAccess`.

## Notes

Site settings CRUD for general, email (Mailgun), and Stripe configuration.
Includes test email sending and Stripe key validation.

<!-- === AUTO-GENERATED SECTION (do not edit below this line) === -->

## Endpoints

| Method | Path | Handler | Line |
|--------|------|---------|------|
| `GET` | `/api/admin/settings/` | Get general site settings | 40 |
| `PATCH` | `/api/admin/settings/` | Update general site settings | 52 |
| `GET` | `/api/admin/settings/email` | Get email (Mailgun) config | 61 |
| `PATCH` | `/api/admin/settings/email` | Update email config | 82 |
| `POST` | `/api/admin/settings/email/test` | Send test email | 130 |
| `POST` | `/api/admin/settings/email/verify` | Verify email config | 150 |
| `GET` | `/api/admin/settings/stripe` | Get Stripe config | 160 |
| `PATCH` | `/api/admin/settings/stripe` | Update Stripe keys | 180 |
| `POST` | `/api/admin/settings/stripe/validate` | Validate Stripe keys | 236 |

### Integrations Status (integrationsStatusRoutes)

| Method | Path | Handler | Line |
|--------|------|---------|------|
| `GET` | `/api/admin/integrations/` | List all integration statuses | 8 |

_10 endpoint(s) detected._

<!-- === END AUTO-GENERATED SECTION === -->
