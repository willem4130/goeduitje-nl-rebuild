export const CONSENT_STORAGE_KEY = "goeduitje_consent_v1";
export const CONSENT_VERSION = 1;
export const OPEN_CONSENT_EVENT = "goeduitje:open-cookie-settings";

export type ConsentCategories = {
  analytics: boolean;
  marketing: boolean;
};

export type StoredConsent = ConsentCategories & {
  version: number;
  timestamp: string;
};

export function readStoredConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function persistConsent(categories: ConsentCategories): StoredConsent {
  const record: StoredConsent = {
    ...categories,
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Quota exceeded or storage disabled — silently ignore.
    }
  }
  return record;
}

export function pushConsentUpdate(categories: ConsentCategories): void {
  if (typeof window === "undefined") return;

  const gtag = window.gtag;
  if (typeof gtag === "function") {
    gtag("consent", "update", {
      analytics_storage: categories.analytics ? "granted" : "denied",
      ad_storage: categories.marketing ? "granted" : "denied",
      ad_user_data: categories.marketing ? "granted" : "denied",
      ad_personalization: categories.marketing ? "granted" : "denied",
    });
    // Stop redacting ad data once the visitor opts into marketing — lets
    // GA4 / Google Ads receive full conversion data instead of modeled.
    gtag("set", "ads_data_redaction", !categories.marketing);
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "consent_update",
    analytics_consent: categories.analytics,
    marketing_consent: categories.marketing,
  });

  // Visitors who land + accept + leave without navigating would only show up
  // in modeled/cookieless data. Fire a real page_view for the current URL
  // once analytics is granted so GA4 records at least one full pageview per
  // consenting session. Guarded by sessionStorage flag to avoid double-count
  // if the user re-opens the cookie preferences from the footer.
  if (categories.analytics) {
    try {
      const sentKey = "goeduitje_post_consent_pageview_sent";
      if (!window.sessionStorage.getItem(sentKey)) {
        window.dataLayer.push({
          event: "page_view",
          page_path: window.location.pathname + window.location.search,
          page_location: window.location.href,
          page_title: document.title,
          page_referrer: document.referrer || undefined,
        });
        window.sessionStorage.setItem(sentKey, "1");
      }
    } catch {
      // sessionStorage disabled — skip the safety guard, still fire once
      window.dataLayer.push({
        event: "page_view",
        page_path: window.location.pathname + window.location.search,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }
}

export function openCookieSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
