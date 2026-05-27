# Goeduitje.nl — GA4 / GTM Setup Reference (Jelle)

Everything you need to verify and configure tracking for **www.goeduitje.nl**.

- **Last updated:** 2026-05-27
- **Maintained by:** engineering (Willem) — flag any gaps and we'll patch the code side.
- **Codebase:** all tracking logic lives in `src/lib/analytics.ts` + `src/components/analytics-trackers.tsx` + `src/components/gtm-pageview.tsx` + `src/lib/consent.ts`.

---

## 1. What the codebase already does for you

The site ships a **complete GA4 standard ecommerce funnel** to `window.dataLayer` using Google's spec event names — no custom variable wiring needed in GTM.

### Loading order in `<head>`

1. **Consent Mode v2 init** (inline `<script id="consent-init">`) — defines `window.gtag`, sets all 7 consent signals to defaults (denied for analytics/marketing, granted for functionality/security), then `gtag('set','ads_data_redaction',true)` + `gtag('set','url_passthrough',true)`. Reads `localStorage` for prior consent and replays it. Runs FIRST.
2. **GTM bootstrap** (inline `<script id="gtm-init">`) — standard GTM IIFE, loads `gtm.js` async. Container ID from `NEXT_PUBLIC_GTM_ID`.
3. **JSON-LD** structured data (Organization, LocalBusiness, WebSite).
4. **noscript GTM iframe** in `<body>` for crawlers.

### `dataLayer` event catalog

| Event              | Trigger                                      | Payload highlights                                                               |
| ------------------ | -------------------------------------------- | -------------------------------------------------------------------------------- |
| `page_view`        | SPA route change + once after consent grant  | `page_path`, `page_location`, `page_title`, `page_referrer`, `page_category`     |
| `view_item`        | Workshop / recipe detail page mount          | `ecommerce.items[]` with `item_id` (slug), `item_name`, `item_category`, `price` |
| `add_to_cart`      | Workshop checkbox toggled ON in configurator | `ecommerce.value`, `ecommerce.items[]`                                           |
| `remove_from_cart` | Workshop checkbox toggled OFF                | `ecommerce.value`, `ecommerce.items[]`                                           |
| `begin_checkout`   | Configurator step 1 → step 2 click           | `ecommerce.value`, full cart                                                     |
| `purchase`         | Configurator submit success                  | `transaction_id` (= `workshopConfig.id`), `value`, `currency: "EUR"`, full cart  |
| `form_start`       | First focus/change on contact form           | `form_name` (`contact_form` or `compact_contact_form`)                           |
| `generate_lead`    | Contact form submit success                  | `form_name`, `event_category`, `event_label`                                     |
| `consent_update`   | User accepts/rejects in consent banner       | `analytics_consent` (bool), `marketing_consent` (bool)                           |

**Custom dimensions already on the payload** (no extra code needed — just create the matching custom definitions in GA4):

- `page_category` — `home` / `workshop_detail` / `workshop_list` / `city_landing` / `recipe_detail` / `form` / `category_teambuilding` / `category_bedrijfsuitjes` / `category_workshops` / `open_workshops` / `recipe_list` / `thank_you` / `faq` / `info`
- `page_referrer` — document.referrer value
- `form_name` — distinguishes which form fired the event
- `analytics_consent` / `marketing_consent` — per-event consent snapshot
- For ecommerce items: `item_id` is the URL slug (stable), `item_category` is `Workshop` or recipe category

### Consent Mode v2 model

| Signal                     | Default | After "Alles accepteren"           | After "Alleen noodzakelijk" |
| -------------------------- | ------- | ---------------------------------- | --------------------------- |
| `analytics_storage`        | denied  | granted                            | denied                      |
| `ad_storage`               | denied  | granted                            | denied                      |
| `ad_user_data`             | denied  | granted                            | denied                      |
| `ad_personalization`       | denied  | granted                            | denied                      |
| `personalization_storage`  | denied  | denied                             | denied                      |
| `functionality_storage`    | granted | granted                            | granted                     |
| `security_storage`         | granted | granted                            | granted                     |
| `ads_data_redaction` (set) | true    | **false** (when marketing granted) | true                        |
| `url_passthrough` (set)    | true    | true                               | true                        |

After grant, the site fires a synthetic `page_view` for the current URL so the landing page is recorded as a full pageview (not just a cookieless ping). Guarded by `sessionStorage` so it fires at most once per session.

### CSP allowlist

Wildcards already in place in `next.config.mjs` for all current and future Google tracking endpoints:
`*.google-analytics.com`, `*.analytics.google.com`, `*.googletagmanager.com`, `*.g.doubleclick.net`, `*.googlesyndication.com`, `*.googleadservices.com`.

If you add a new third-party tag (Meta Pixel, LinkedIn Insight, Hotjar, etc.), let us know the host and we'll add it to the CSP.

---

## 2. GTM Container checklist (web)

- [ ] **GA4 Configuration tag** exists with the correct Measurement ID (`G-XXXXXXXX`).
  - [ ] "Send a page view event when this configuration loads" = **enabled** (the SPA pageview tracker intentionally skips the initial mount, so the GA4 Config tag must cover it).
  - [ ] Fields to set: `page_category` (Data Layer Variable), `page_referrer` (Data Layer Variable).
- [ ] **Custom Event triggers** defined for each event in the catalog above:
  - [ ] `page_view`, `view_item`, `add_to_cart`, `remove_from_cart`, `begin_checkout`, `purchase`, `form_start`, `generate_lead`, `consent_update`
- [ ] **GA4 Event tag per ecommerce event** with "Send Ecommerce data" → Data source: **Data Layer**.
- [ ] **Consent settings on every tag** (this is the most common reason for low data — without it, denied visitors send NOTHING instead of cookieless pings):
  - [ ] Analytics tags: Require `analytics_storage`.
  - [ ] Marketing / Ads tags: Require `ad_storage` + `ad_user_data` + `ad_personalization`.
- [ ] **Built-in variables** enabled: Click variables, Form variables, Scroll variables, History Change variables.
- [ ] **Data Layer Variables** defined: `page_category`, `page_referrer`, `form_name`, `analytics_consent`, `marketing_consent`, and `ecommerce.value`, `ecommerce.items` if you want per-tag exposure.
- [ ] **Container version published** (preview-mode changes don't fire for real visitors).

---

## 3. GA4 Admin checklist

### Property → Data Streams → Web stream

- [ ] **Enhanced Measurement** — turn ON all available:
  - [ ] Page views (already covered by SPA + GA4 Config tag)
  - [ ] Scrolls (90% depth)
  - [ ] Outbound clicks
  - [ ] Site search — N/A
  - [ ] Video engagement
  - [ ] File downloads
  - [ ] Form interactions
- [ ] **Cookie settings**: cookie domain = `auto`.
- [ ] **Cross-domain measurement** — if `admin.goeduitje.nl` should share a single visitor identity with `www.goeduitje.nl`, add it here. Otherwise leave blank.
- [ ] **Internal traffic** — add the office IP so admin/staff traffic is filtered from reports.

### Property settings

- [ ] **Reporting Identity** set to **Blended** (Admin → Property → Reporting Identity).
  - **This is the single most common reason for "low GA4 numbers".** Blended layers observed → modeled → Google signals. Without it, modeled data from cookieless pings is invisible.
- [ ] **Data retention**: 14 months (the free-tier max).
- [ ] **Consent settings → Behavioral & Conversion modeling**: enable both.
  - Modeling thresholds: ~1k events/day per consent-status combination. Small site will need ~a few weeks of traffic before models kick in.

### Events → Mark as conversion

- [ ] `purchase` ✓
- [ ] `generate_lead` ✓
- [ ] `begin_checkout` — optional, useful for funnel reporting
- [ ] `form_start` — **do not** mark as conversion (it's a funnel step)

### Custom Definitions

- [ ] Custom dimension `page_category` (event-scoped, parameter `page_category`)
- [ ] Custom dimension `form_name` (event-scoped, parameter `form_name`)
- [ ] Custom dimension `analytics_consent` (event-scoped, parameter `analytics_consent`)
- [ ] Custom dimension `marketing_consent` (event-scoped, parameter `marketing_consent`)
- [ ] Custom metric `value` (already standard on `purchase` / `begin_checkout` — currency EUR)

---

## 4. Linking & integrations

- [ ] **Search Console** ↔ GA4 (Admin → Product links → Search Console) — required for organic-search reports.
- [ ] **Google Ads** ↔ GA4 (Admin → Product links → Google Ads) — required for conversion import + audiences.
  - [ ] **Enhanced Conversions for Web** — turn on in Google Ads admin. Requires hashed email/phone to be sent with conversion events. **Flag back to engineering if you want this** — needs additional SHA-256 hashing code in the form submit handlers.
- [ ] **BigQuery export** (Admin → BigQuery Links) — free for GA4, unlimited retention + raw event SQL access. Recommended for any serious reporting.
- [ ] **Merchant Center** — N/A (no product feed).

---

## 5. Diagnostics (do these to confirm everything works)

### A. GTM Preview Mode

1. Load https://www.goeduitje.nl in preview.
2. Verify on each page load: `consent-init` → `gtm.js` → GA4 Config fires.
3. Click through the configurator: `view_item` → `add_to_cart` → `begin_checkout` → `purchase`.
4. Submit a contact form: `form_start` (on first input) → `generate_lead` (on submit).

### B. GA4 DebugView

1. Install the [GA4 Debugger Chrome extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna).
2. Navigate the site, watch events stream in GA4 → Admin → DebugView.
3. Check the parameters tab to confirm `page_category`, `form_name`, `value`, `currency` are populated.

### C. GA4 Realtime

Should show pageviews + events within ~10 seconds of loading the site.

### D. Tag Assistant Companion

1. Install [Tag Assistant Companion](https://chrome.google.com/webstore/detail/tag-assistant-companion/jmekfmbnaedfebfnmakmokmlfpblbfdm).
2. Load the site, open the Tag Assistant.
3. Verify **Consent State** shows the right signals as denied/granted before and after clicking "Alles accepteren" / "Alleen noodzakelijk".

### E. Network tab spot-check

In Chrome DevTools → Network → filter `collect`:

- Before consent: requests to `region1.analytics.google.com/g/collect` should have `gcs=G100` (denied) — cookieless pings.
- After accept: same URL with `gcs=G111` (granted) — full events.
- If you see **no requests at all** → CSP is blocking (let us know).
- If requests fire but GA4 shows nothing → Reporting Identity isn't Blended, OR consent settings on the tag are wrong.

---

## 6. Still seeing low data after all of the above?

In order of likelihood:

1. **Reporting Identity stuck on "Observed"** — Blended is what surfaces modeled data. Switch it.
2. **Consent settings missing on tags** — without these, denied visitors send NOTHING. Audit every tag in GTM, not just GA4.
3. **GA4 property < ~30 days old** — modeling needs traffic + time to calibrate.
4. **Marked the wrong events as conversions** — only mark events that represent actual business goals.
5. **Tracker / ad blocker share** — typical 20-30% on EU traffic, expected.
6. **Cross-domain setup missing** — if visitors hop from `www.` to `admin.` (or vice versa) without the linker configured, GA4 sees them as separate users with broken session continuity.
7. **GTM container not published** — preview-mode-only changes don't apply.

If something else is off, let engineering know which event/dimension is missing or wrong and we'll patch the code.

---

## 7. Optional next-level additions (engineering can wire on request)

- **Enhanced Conversions for Web** — hash email + phone with SHA-256 on form submit, send with `purchase` / `generate_lead`. Boosts Google Ads attribution significantly.
- **`select_item` events** on workshop card clicks (carousel + city landing pages) — adds list-performance insight.
- **`view_item_list` events** on category pages — adds list impressions.
- **Outbound click listener** — already covered by GA4 Enhanced Measurement; only needed if you want richer per-link metadata.
- **Server-side GTM container** — reduces client-side weight, bypasses some ad blockers, gives you control over what hits Google. Significant infra change.
- **First-party `_ga` cookie via server** — improves cookie lifespan on Safari (ITP cap workaround).

Ping engineering with the priority list and we'll plan accordingly.
