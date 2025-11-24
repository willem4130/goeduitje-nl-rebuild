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
        src="https://cdn.lightwidget.com/widgets/fbd502f91f3e57c798ee1fdec322862e.html"
        scrolling="no"
        allowTransparency={true}
        className="lightwidget-widget w-full overflow-hidden border-0"
        style={{ width: "100%", border: 0, overflow: "hidden" }}
        title="Instagram Feed"
      />
    </>
  );
}
