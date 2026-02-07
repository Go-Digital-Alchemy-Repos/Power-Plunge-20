# Payments (Public)

## Module Info

| Property | Value |
|----------|-------|
| Domain | payments |
| Source Files | server/src/routes/public/payments.routes.ts |
| Endpoint Count | 6 |
| Mount Point | `/api` |
| Auth Middleware | None (public); rate limiters on payment endpoints |

## Notes

Revenue-critical payment flow endpoints. Handles Stripe configuration, referral code validation, payment intent creation, payment confirmation, legacy checkout session creation, and session-based order lookup.
Rate limiters (`paymentLimiter`, `checkoutLimiter`) are applied per-route within the router file.
Helper function `sendOrderNotification()` was relocated here from legacy routes.ts during extraction.

<!-- === AUTO-GENERATED SECTION (do not edit below this line) === -->

## Endpoints

| Method | Path | Handler | Line |
|--------|------|---------|------|
| `GET` | `/api/stripe/config` | Get Stripe publishable key | 9 |
| `GET` | `/api/validate-referral-code/:code` | Validate affiliate referral code | 16 |
| `POST` | `/api/create-payment-intent` | Create Stripe payment intent (rate limited) | 33 |
| `POST` | `/api/confirm-payment` | Confirm payment and create order (rate limited) | 193 |
| `POST` | `/api/checkout` | Legacy Stripe Checkout session (rate limited) | 280 |
| `GET` | `/api/orders/by-session/:sessionId` | Look up order by Stripe session ID | 455 |

_6 endpoint(s) detected._

<!-- === END AUTO-GENERATED SECTION === -->
