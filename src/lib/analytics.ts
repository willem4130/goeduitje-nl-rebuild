"use client";

// Centralized GA4 / GTM dataLayer helpers. Every helper pushes Google's
// **standard** event name so the consultant's GTM container can map them to
// GA4 events without bespoke variable wiring.
//
// Reference: https://developers.google.com/analytics/devguides/collection/ga4/reference/events
// and https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
//
// SSR safety: every helper no-ops when window is undefined.

export type Currency = "EUR";

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
};

function safePush(payload: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

function safePushEcommerce(
  event: string,
  ecommerce: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // Clear any stale ecommerce object before the next event (GA4 best practice).
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ event, ecommerce });
}

/** Categorize the current path so GA4 can segment by content type. */
export function getPageCategory(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/onze-uitjes/") || pathname === "/kookworkshop") {
    return "workshop_detail";
  }
  if (pathname === "/onze-uitjes") return "workshop_list";
  if (pathname === "/teambuilding") return "category_teambuilding";
  if (pathname === "/bedrijfsuitjes") return "category_bedrijfsuitjes";
  if (pathname === "/workshops") return "category_workshops";
  if (pathname.startsWith("/recepten/")) return "recipe_detail";
  if (pathname === "/recepten") return "recipe_list";
  if (pathname === "/open-kookworkshops") return "open_workshops";
  if (pathname === "/contact" || pathname === "/feedback") return "form";
  if (pathname === "/bedankt") return "thank_you";
  if (pathname === "/faq") return "faq";
  if (
    pathname.startsWith("/kookworkshop-") ||
    pathname.startsWith("/stadsspel-") ||
    pathname.startsWith("/teambuilding-") ||
    pathname.startsWith("/bedrijfsuitje-")
  ) {
    return "city_landing";
  }
  return "info";
}

/** Workshop / recipe detail view. */
export function trackViewItem(
  item: AnalyticsItem,
  currency: Currency = "EUR"
): void {
  safePushEcommerce("view_item", {
    currency,
    value: item.price ?? 0,
    items: [{ ...item, quantity: item.quantity ?? 1 }],
  });
}

/** Workshop catalog / category listing view. */
export function trackViewItemList(
  items: AnalyticsItem[],
  listName: string,
  listId?: string
): void {
  safePushEcommerce("view_item_list", {
    item_list_id: listId ?? listName,
    item_list_name: listName,
    items: items.map((item, index) => ({
      ...item,
      index,
      quantity: item.quantity ?? 1,
    })),
  });
}

/** User clicked into a workshop from a list. */
export function trackSelectItem(
  item: AnalyticsItem,
  listName: string,
  listId?: string
): void {
  safePushEcommerce("select_item", {
    item_list_id: listId ?? listName,
    item_list_name: listName,
    items: [{ ...item, quantity: item.quantity ?? 1 }],
  });
}

/** Workshop added to the configurator selection. */
export function trackAddToCart(
  item: AnalyticsItem,
  currency: Currency = "EUR"
): void {
  safePushEcommerce("add_to_cart", {
    currency,
    value: (item.price ?? 0) * (item.quantity ?? 1),
    items: [{ ...item, quantity: item.quantity ?? 1 }],
  });
}

/** Workshop removed from the configurator selection. */
export function trackRemoveFromCart(
  item: AnalyticsItem,
  currency: Currency = "EUR"
): void {
  safePushEcommerce("remove_from_cart", {
    currency,
    value: (item.price ?? 0) * (item.quantity ?? 1),
    items: [{ ...item, quantity: item.quantity ?? 1 }],
  });
}

/** Configurator opened / first interaction with a checkout flow. */
export function trackBeginCheckout(
  items: AnalyticsItem[],
  value: number,
  currency: Currency = "EUR"
): void {
  safePushEcommerce("begin_checkout", {
    currency,
    value,
    items: items.map((item) => ({ ...item, quantity: item.quantity ?? 1 })),
  });
}

/** Lead-style form submission (contact, feedback, etc.). */
export function trackGenerateLead(
  formName: string,
  options: { value?: number; currency?: Currency; category?: string } = {}
): void {
  safePush({
    event: "generate_lead",
    event_category: options.category ?? "contact",
    event_label: formName,
    value: options.value,
    currency: options.value ? (options.currency ?? "EUR") : undefined,
    form_name: formName,
  });
}

/** Booking confirmed. */
export function trackPurchase(args: {
  transactionId: string;
  value: number;
  items: AnalyticsItem[];
  currency?: Currency;
  coupon?: string;
}): void {
  safePushEcommerce("purchase", {
    transaction_id: args.transactionId,
    currency: args.currency ?? "EUR",
    value: args.value,
    coupon: args.coupon,
    items: args.items.map((item) => ({
      ...item,
      quantity: item.quantity ?? 1,
    })),
  });
}

/** Fired once per form when the visitor first interacts with it. */
export function trackFormStart(formName: string): void {
  safePush({
    event: "form_start",
    form_name: formName,
  });
}

/** Outbound link click (used by the global click listener). */
export function trackOutboundClick(url: string, linkText?: string): void {
  safePush({
    event: "click_outbound",
    link_url: url,
    link_text: linkText,
    outbound: true,
  });
}
