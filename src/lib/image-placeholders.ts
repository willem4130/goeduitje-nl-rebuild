/**
 * Image placeholder utilities for Next.js Image component
 * Provides blur placeholders for better perceived performance
 */

/**
 * Generate a gradient blur placeholder (base64)
 * Useful for images with varied colors
 */
function generateGradientBlurDataURL(
  colorFrom: string,
  colorTo: string
): string {
  const svg = `
    <svg width="1" height="1" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colorFrom}" />
          <stop offset="100%" style="stop-color:${colorTo}" />
        </linearGradient>
      </defs>
      <rect width="1" height="1" fill="url(#grad)" />
    </svg>
  `;

  const base64 = Buffer.from(svg).toString("base64");

  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Workshop-specific blur placeholders
 * These are low-saturation colors matching each workshop theme
 */
export const WORKSHOP_BLUR_PLACEHOLDERS = {
  kookworkshop: generateGradientBlurDataURL("#F5E6D3", "#E8D4BB"),
  stadsspel: generateGradientBlurDataURL("#D4E4F7", "#C2D9F0"),
  "the-game": generateGradientBlurDataURL("#E8E8E8", "#D1D1D1"),
  "koffie-thee": generateGradientBlurDataURL("#E5D4C1", "#D4C2AF"),
  beachvolleybal: generateGradientBlurDataURL("#F9E5C9", "#F0D9B5"),
  "lunch-diner": generateGradientBlurDataURL("#F5E6D3", "#E8D4BB"),
  "bouw-of-bak-battle": generateGradientBlurDataURL("#E8D8C8", "#D4C4B4"),
} as const;
