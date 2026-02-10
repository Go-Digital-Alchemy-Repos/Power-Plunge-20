declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

let currentMeasurementId: string | null = null;

export const initGA = (measurementId?: string) => {
  const id = measurementId || import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!id) return;

  if (currentMeasurementId === id) return;
  currentMeasurementId = id;

  const existing = document.querySelector(`script[src*="googletagmanager.com/gtag"]`);
  if (existing) existing.remove();

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id);
};

export const initGAFromSettings = async () => {
  try {
    const res = await fetch("/api/site-settings");
    if (!res.ok) return;
    const data = await res.json();
    if (data.gaMeasurementId) {
      initGA(data.gaMeasurementId);
    } else if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      initGA(import.meta.env.VITE_GA_MEASUREMENT_ID);
    }
  } catch {
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      initGA(import.meta.env.VITE_GA_MEASUREMENT_ID);
    }
  }
};

export const trackPageView = (url: string) => {
  if (typeof window === "undefined" || !window.gtag || !currentMeasurementId) return;
  window.gtag("config", currentMeasurementId, { page_path: url });
};

export const trackEvent = (
  action: string,
  category?: string,
  label?: string,
  value?: number,
) => {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};

export const trackEcommerceEvent = (
  eventName: string,
  params: Record<string, any>,
) => {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
};

export const trackViewItem = (item: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) => {
  trackEcommerceEvent("view_item", {
    currency: "USD",
    value: item.price,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        item_category: item.category || "Cold Plunge",
      },
    ],
  });
};

export const trackAddToCart = (item: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}) => {
  trackEcommerceEvent("add_to_cart", {
    currency: "USD",
    value: item.price * item.quantity,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
        item_category: item.category || "Cold Plunge",
      },
    ],
  });
};

export const trackRemoveFromCart = (item: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) => {
  trackEcommerceEvent("remove_from_cart", {
    currency: "USD",
    value: item.price * item.quantity,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      },
    ],
  });
};

export const trackBeginCheckout = (items: Array<{
  id: string;
  name: string;
  price: number;
  quantity: number;
}>, totalValue: number) => {
  trackEcommerceEvent("begin_checkout", {
    currency: "USD",
    value: totalValue,
    items: items.map((i) => ({
      item_id: i.id,
      item_name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
  });
};

export const trackPurchase = (transaction: {
  transactionId: string;
  value: number;
  tax?: number;
  shipping?: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}) => {
  trackEcommerceEvent("purchase", {
    transaction_id: transaction.transactionId,
    currency: "USD",
    value: transaction.value,
    tax: transaction.tax || 0,
    shipping: transaction.shipping || 0,
    items: transaction.items.map((i) => ({
      item_id: i.id,
      item_name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
  });
};

export const trackViewItemList = (
  listName: string,
  items: Array<{ id: string; name: string; price: number }>,
) => {
  trackEcommerceEvent("view_item_list", {
    item_list_name: listName,
    items: items.map((i, index) => ({
      item_id: i.id,
      item_name: i.name,
      price: i.price,
      index,
    })),
  });
};

export const trackSearch = (searchTerm: string) => {
  trackEvent("search", "engagement", searchTerm);
};

export const trackSignUp = (method: string) => {
  trackEvent("sign_up", "engagement", method);
};

export const trackLogin = (method: string) => {
  trackEvent("login", "engagement", method);
};
