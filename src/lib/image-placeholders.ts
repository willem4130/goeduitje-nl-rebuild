/**
 * Image placeholder utilities for Next.js Image component
 * Provides blur placeholders for better perceived performance
 */

/**
 * Generate a simple solid color blur placeholder (base64)
 * @param color - Hex color code (e.g., "#C84869")
 * @returns Base64 encoded 1x1 pixel image
 */
export function generateSolidBlurDataURL(color: string): string {
  // Remove # from hex color
  const hex = color.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Create tiny SVG (faster to decode than base64 image)
  const svg = `
    <svg width="1" height="1" xmlns="http://www.w3.org/2000/svg">
      <rect width="1" height="1" fill="rgb(${r},${g},${b})" />
    </svg>
  `;

  // Encode to base64
  const base64 = Buffer.from(svg).toString("base64");

  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Generate a gradient blur placeholder (base64)
 * Useful for images with varied colors
 */
export function generateGradientBlurDataURL(
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
  "design-tshirt": generateGradientBlurDataURL("#E8D4F0", "#D9C2E5"),
} as const;

/**
 * Hero poster blur placeholder (neutral dark for video poster)
 */
export const HERO_BLUR_PLACEHOLDER = generateSolidBlurDataURL("#1A1A1A");

/**
 * Default blur placeholder (neutral gray)
 */
export const DEFAULT_BLUR_PLACEHOLDER = generateSolidBlurDataURL("#E5E5E5");

/**
 * Generate a shimmer effect blur placeholder
 * Creates an animated shimmer effect during image load
 */
export function generateShimmerBlurDataURL(): string {
  const svg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#f0f0f0" />
          <stop offset="50%" style="stop-color:#e0e0e0" />
          <stop offset="100%" style="stop-color:#f0f0f0" />
          <animate attributeName="x1" from="-100%" to="100%" dur="2s" repeatCount="indefinite" />
          <animate attributeName="x2" from="0%" to="200%" dur="2s" repeatCount="indefinite" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#shimmer)" />
    </svg>
  `;

  const base64 = Buffer.from(svg).toString("base64");

  return `data:image/svg+xml;base64,${base64}`;
}
