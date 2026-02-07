# Stripe Webhooks

## Module Info

| Property | Value |
|----------|-------|
| Domain | webhooks-stripe |
| Source Files | server/src/routes/webhooks/stripe.routes.ts |
| Endpoint Count | 2 |
| Mount Point | `/api/webhook` |
| Auth Middleware | None (Stripe signature verification used instead) |

## Notes

Revenue-critical webhook handlers for Stripe events. Requires raw body parsing (not JSON) for signature verification.
Handles standard Stripe events (payment_intent.succeeded, checkout.session.completed) and Stripe Connect events (account.updated).
Must be mounted BEFORE the JSON body parser middleware in Express.

<!-- === AUTO-GENERATED SECTION (do not edit below this line) === -->

## Endpoints

| Method | Path | Handler | Line |
|--------|------|---------|------|
| `POST` | `/api/webhook/stripe` | Standard Stripe webhook | 9 |
| `POST` | `/api/webhook/stripe/connect` | Stripe Connect webhook | 147 |

_2 endpoint(s) detected._

<!-- === END AUTO-GENERATED SECTION === -->
