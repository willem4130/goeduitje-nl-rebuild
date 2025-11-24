"use client";

import Script from "next/script";

export function InstagramFeed() {
  return (
    <>
      {/* Load LightWidget script */}
      <Script
        src="https://cdn.lightwidget.com/widgets/lightwidget.js"
        strategy="lazyOnload"
      />

      {/* LightWidget iframe embed */}
      <iframe
        src="https://lightwidget.com/widgets/ca86e6e88cb159f7a9378caae8951c9a.html"
        scrolling="no"
        allowTransparency={true}
        className="lightwidget-widget w-full overflow-hidden border-0"
        style={{ width: "100%", border: 0, overflow: "hidden" }}
      />
    </>
  );
}
