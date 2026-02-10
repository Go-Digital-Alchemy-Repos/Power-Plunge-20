type CheckoutEvent =
  | "checkout_started"
  | "shipping_step_completed"
  | "payment_step_started"
  | "validation_error"
  | "payment_submitted"
  | "payment_succeeded"
  | "payment_failed";

interface EventMetadata {
  cartValue?: number;
  itemCount?: number;
  billingSameAsShipping?: boolean;
  deviceType?: string;
  field?: string;
  code?: string;
  error?: string;
  [key: string]: unknown;
}

function getDeviceType(): string {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

export function trackCheckoutEvent(event: CheckoutEvent, metadata: EventMetadata = {}) {
  const payload = {
    event,
    timestamp: new Date().toISOString(),
    deviceType: getDeviceType(),
    ...metadata,
  };

  console.log(`[CHECKOUT_ANALYTICS] ${event}`, payload);

  try {
    if (typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon(
        "/api/analytics/checkout-event",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );
    }
  } catch {}
}
