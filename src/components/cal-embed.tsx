"use client";

import { useEffect } from "react";

interface CalEmbedProps {
  calLink: string;
  config?: {
    name?: string;
    email?: string;
    notes?: string;
    guests?: string[];
    theme?: "light" | "dark" | "auto";
  };
  embedType?: "inline" | "floating-popup" | "popup";
  className?: string;
}

export function CalEmbed({ calLink, config, className = "" }: CalEmbedProps) {
  useEffect(() => {
    // Load Cal.com embed script
    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const embedConfig = config
    ? JSON.stringify(config).replace(/"/g, "&quot;")
    : "";

  return (
    <div
      className={className}
      data-cal-link={calLink}
      data-cal-config={embedConfig}
      data-cal-namespace=""
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
    />
  );
}

interface CalButtonProps {
  calLink: string;
  children: React.ReactNode;
  config?: {
    name?: string;
    email?: string;
    notes?: string;
    guests?: string[];
    theme?: "light" | "dark" | "auto";
  };
  className?: string;
}

export function CalButton({
  calLink,
  children,
  config,
  className = "",
}: CalButtonProps) {
  useEffect(() => {
    // Load Cal.com embed script
    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const embedConfig = config
    ? JSON.stringify(config).replace(/"/g, "&quot;")
    : "";

  return (
    <button
      className={className}
      data-cal-link={calLink}
      data-cal-config={embedConfig}
      data-cal-namespace=""
    >
      {children}
    </button>
  );
}
