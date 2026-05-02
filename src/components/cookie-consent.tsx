"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  ConsentCategories,
  OPEN_CONSENT_EVENT,
  persistConsent,
  pushConsentUpdate,
  readStoredConsent,
} from "@/lib/consent";

type Mode = "hidden" | "summary" | "preferences";

const ALL_GRANTED: ConsentCategories = { analytics: true, marketing: true };
const ALL_DENIED: ConsentCategories = { analytics: false, marketing: false };

export function CookieConsent() {
  const [mode, setMode] = useState<Mode>("hidden");
  const [categories, setCategories] = useState<ConsentCategories>(ALL_DENIED);

  useEffect(() => {
    const existing = readStoredConsent();
    if (existing) {
      setCategories({
        analytics: existing.analytics,
        marketing: existing.marketing,
      });
    } else {
      const timer = window.setTimeout(() => setMode("summary"), 600);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      const existing = readStoredConsent();
      if (existing) {
        setCategories({
          analytics: existing.analytics,
          marketing: existing.marketing,
        });
      }
      setMode("preferences");
    };
    window.addEventListener(OPEN_CONSENT_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, handleOpen);
  }, []);

  const commit = useCallback((next: ConsentCategories) => {
    setCategories(next);
    persistConsent(next);
    pushConsentUpdate(next);
    setMode("hidden");
  }, []);

  const acceptAll = () => commit(ALL_GRANTED);
  const rejectAll = () => commit(ALL_DENIED);
  const saveSelection = () => commit(categories);

  return (
    <AnimatePresence>
      {mode !== "hidden" && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 220 }}
          className="fixed inset-x-0 bottom-0 z-50 p-4 md:p-6"
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-consent-title"
        >
          <div className="shadow-editorial-lg border-border bg-background mx-auto max-w-3xl border p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 hidden h-10 w-10 flex-shrink-0 items-center justify-center sm:flex">
                <Cookie className="text-primary h-5 w-5" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2
                  id="cookie-consent-title"
                  className="text-foreground text-lg font-semibold tracking-tight"
                >
                  We waarderen je privacy
                </h2>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Wij gebruiken cookies om onze website te verbeteren, het
                  bezoek te analyseren en relevante advertenties te tonen. Je
                  kunt zelf kiezen welke cookies we mogen plaatsen. Lees meer in
                  ons{" "}
                  <Link
                    href="/cookies"
                    className="text-foreground underline underline-offset-2 hover:opacity-80"
                  >
                    cookiebeleid
                  </Link>{" "}
                  en{" "}
                  <Link
                    href="/privacy"
                    className="text-foreground underline underline-offset-2 hover:opacity-80"
                  >
                    privacybeleid
                  </Link>
                  .
                </p>

                {mode === "preferences" && (
                  <div className="border-border mt-5 space-y-3 border-t pt-5">
                    <ConsentRow
                      title="Noodzakelijk"
                      description="Vereist voor het functioneren van de website (zoals sessies en beveiliging). Deze cookies kunnen niet worden uitgeschakeld."
                      checked
                      disabled
                    />
                    <ConsentRow
                      title="Analytisch"
                      description="Helpt ons te begrijpen hoe bezoekers de site gebruiken, zodat we hem kunnen verbeteren (Google Analytics)."
                      checked={categories.analytics}
                      onChange={(checked) =>
                        setCategories((prev) => ({
                          ...prev,
                          analytics: checked,
                        }))
                      }
                    />
                    <ConsentRow
                      title="Marketing"
                      description="Maakt het mogelijk om gepersonaliseerde advertenties te tonen op andere websites (Google Ads)."
                      checked={categories.marketing}
                      onChange={(checked) =>
                        setCategories((prev) => ({
                          ...prev,
                          marketing: checked,
                        }))
                      }
                    />
                  </div>
                )}

                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  {mode === "summary" ? (
                    <>
                      <button
                        type="button"
                        onClick={acceptAll}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 text-sm font-medium transition-colors"
                      >
                        Alles accepteren
                      </button>
                      <button
                        type="button"
                        onClick={rejectAll}
                        className="border-border text-foreground hover:bg-muted/40 border px-5 py-2.5 text-sm font-medium transition-colors"
                      >
                        Alleen noodzakelijk
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode("preferences")}
                        className="text-muted-foreground hover:text-foreground px-5 py-2.5 text-sm font-medium underline underline-offset-4 transition-colors"
                      >
                        Voorkeuren aanpassen
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={saveSelection}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 text-sm font-medium transition-colors"
                      >
                        Voorkeuren opslaan
                      </button>
                      <button
                        type="button"
                        onClick={acceptAll}
                        className="border-border text-foreground hover:bg-muted/40 border px-5 py-2.5 text-sm font-medium transition-colors"
                      >
                        Alles accepteren
                      </button>
                      <button
                        type="button"
                        onClick={rejectAll}
                        className="text-muted-foreground hover:text-foreground px-5 py-2.5 text-sm font-medium underline underline-offset-4 transition-colors"
                      >
                        Alles weigeren
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ConsentRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <label
      className={`flex items-start gap-3 ${
        disabled ? "opacity-60" : "cursor-pointer"
      }`}
    >
      <input
        type="checkbox"
        className="border-border text-primary focus:ring-primary mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      <span className="flex-1">
        <span className="text-foreground block text-sm font-medium">
          {title}
        </span>
        <span className="text-muted-foreground mt-0.5 block text-xs leading-relaxed">
          {description}
        </span>
      </span>
    </label>
  );
}
