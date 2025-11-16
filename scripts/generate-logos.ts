#!/usr/bin/env bun
/**
 * Generate Logo Variants for Goeduitje.nl
 *
 * This script creates optimized logo variants for:
 * - Favicons (16x16, 32x32, 180x180, 192x192, 512x512)
 * - Open Graph images (1200x630)
 * - Twitter cards (1200x600)
 * - Navigation logos (optimized sizes)
 */

import sharp from "sharp";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

const PUBLIC_DIR = join(process.cwd(), "public");
const LOGO_DIR = join(PUBLIC_DIR, "images", "logo");

// Source logos
const LOGO_FULL = join(LOGO_DIR, "logo-full.png");
const LOGO_SIMPLIFIED = join(LOGO_DIR, "logo-simplified.png");

interface LogoVariant {
  name: string;
  width: number;
  height?: number;
  fit?: keyof sharp.FitEnum;
  background?: { r: number; g: number; b: number; alpha: number };
}

// Logo variants to generate
const FAVICON_VARIANTS: LogoVariant[] = [
  { name: "favicon-16x16.png", width: 16, height: 16, fit: "contain" },
  { name: "favicon-32x32.png", width: 32, height: 32, fit: "contain" },
  { name: "apple-touch-icon.png", width: 180, height: 180, fit: "contain" },
  {
    name: "android-chrome-192x192.png",
    width: 192,
    height: 192,
    fit: "contain",
  },
  {
    name: "android-chrome-512x512.png",
    width: 512,
    height: 512,
    fit: "contain",
  },
];

async function ensureDirectories() {
  await mkdir(PUBLIC_DIR, { recursive: true });
  console.log("✓ Directories ready");
}

async function generateFavicons() {
  console.log("\n🎨 Generating favicons...");

  for (const variant of FAVICON_VARIANTS) {
    try {
      await sharp(LOGO_SIMPLIFIED)
        .resize(variant.width, variant.height, {
          fit: variant.fit || "contain",
          background: variant.background || {
            r: 255,
            g: 255,
            b: 255,
            alpha: 0,
          },
        })
        .png()
        .toFile(join(PUBLIC_DIR, variant.name));

      console.log(`  ✓ Generated ${variant.name}`);
    } catch (error) {
      console.error(`  ✗ Failed to generate ${variant.name}:`, error);
    }
  }

  // Generate favicon.ico (multi-resolution)
  try {
    await sharp(LOGO_SIMPLIFIED)
      .resize(32, 32, { fit: "contain" })
      .toFile(join(PUBLIC_DIR, "favicon.ico"));
    console.log("  ✓ Generated favicon.ico");
  } catch (error) {
    console.error("  ✗ Failed to generate favicon.ico:", error);
  }
}

async function generateNavigationLogos() {
  console.log("\n🧭 Generating navigation logos...");

  // Desktop nav - simplified logo
  await sharp(LOGO_SIMPLIFIED)
    .resize(240, null, { fit: "inside" })
    .png()
    .toFile(join(LOGO_DIR, "logo-nav-desktop.png"));
  console.log("  ✓ Generated logo-nav-desktop.png");

  // Mobile nav - simplified logo (smaller)
  await sharp(LOGO_SIMPLIFIED)
    .resize(140, null, { fit: "inside" })
    .png()
    .toFile(join(LOGO_DIR, "logo-nav-mobile.png"));
  console.log("  ✓ Generated logo-nav-mobile.png");

  // Footer - full logo with tagline
  await sharp(LOGO_FULL)
    .resize(320, null, { fit: "inside" })
    .png()
    .toFile(join(LOGO_DIR, "logo-footer.png"));
  console.log("  ✓ Generated logo-footer.png");
}

async function generateSocialImages() {
  console.log("\n📱 Generating social media images...");

  // Create branded background color (light green from logo)
  const brandBackground = { r: 247, g: 250, b: 242 }; // Light green tint

  // Open Graph image (1200x630) - Facebook, LinkedIn
  try {
    const ogImage = await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 3,
        background: brandBackground,
      },
    })
      .png()
      .toBuffer();

    const logoBuffer = await sharp(LOGO_FULL)
      .resize(800, null, { fit: "inside" })
      .toBuffer();

    await sharp(ogImage)
      .composite([
        {
          input: logoBuffer,
          gravity: "center",
        },
      ])
      .toFile(join(PUBLIC_DIR, "og-image.png"));

    console.log("  ✓ Generated og-image.png (1200x630)");
  } catch (error) {
    console.error("  ✗ Failed to generate og-image.png:", error);
  }

  // Twitter image (1200x600)
  try {
    const twitterImage = await sharp({
      create: {
        width: 1200,
        height: 600,
        channels: 3,
        background: brandBackground,
      },
    })
      .png()
      .toBuffer();

    const logoBuffer = await sharp(LOGO_FULL)
      .resize(800, null, { fit: "inside" })
      .toBuffer();

    await sharp(twitterImage)
      .composite([
        {
          input: logoBuffer,
          gravity: "center",
        },
      ])
      .toFile(join(PUBLIC_DIR, "twitter-image.png"));

    console.log("  ✓ Generated twitter-image.png (1200x600)");
  } catch (error) {
    console.error("  ✗ Failed to generate twitter-image.png:", error);
  }
}

async function generateManifestIcons() {
  console.log("\n📦 Generating web manifest icons...");

  // Web app manifest icons
  const manifestIcons = [
    { name: "icon-192.png", size: 192 },
    { name: "icon-512.png", size: 512 },
  ];

  for (const icon of manifestIcons) {
    await sharp(LOGO_SIMPLIFIED)
      .resize(icon.size, icon.size, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .png()
      .toFile(join(PUBLIC_DIR, icon.name));
    console.log(`  ✓ Generated ${icon.name}`);
  }
}

async function optimizeSourceLogos() {
  console.log("\n🔧 Optimizing source logos...");

  // Optimize full logo
  await sharp(LOGO_FULL)
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(join(LOGO_DIR, "logo-full-optimized.png"));
  console.log("  ✓ Optimized logo-full.png");

  // Optimize simplified logo
  await sharp(LOGO_SIMPLIFIED)
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(join(LOGO_DIR, "logo-simplified-optimized.png"));
  console.log("  ✓ Optimized logo-simplified.png");
}

async function generateSiteWebmanifest() {
  console.log("\n📄 Generating site.webmanifest...");

  const manifest = {
    name: "Goeduitje.nl",
    short_name: "Goeduitje",
    description: "Workshops & Teambuildinguitjes met een verhaal",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#A4BF2F",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };

  await writeFile(
    join(PUBLIC_DIR, "site.webmanifest"),
    JSON.stringify(manifest, null, 2)
  );
  console.log("  ✓ Generated site.webmanifest");
}

async function main() {
  console.log("🚀 Goeduitje.nl Logo Generator\n");
  console.log("━".repeat(50));

  try {
    await ensureDirectories();
    await generateFavicons();
    await generateNavigationLogos();
    await generateSocialImages();
    await generateManifestIcons();
    await optimizeSourceLogos();
    await generateSiteWebmanifest();

    console.log("\n━".repeat(50));
    console.log("✨ All logo variants generated successfully!\n");
    console.log("Generated files:");
    console.log("  • Favicons (16x16, 32x32, 180x180, 192x192, 512x512)");
    console.log("  • Navigation logos (desktop, mobile, footer)");
    console.log("  • Social images (OG, Twitter)");
    console.log("  • Web manifest");
    console.log("\n📍 Next steps:");
    console.log("  1. Update src/app/layout.tsx with new metadata");
    console.log("  2. Update src/components/top-navigation.tsx with logo");
    console.log("  3. Create footer component with logo");
    console.log("  4. Test on all devices and social platforms");
  } catch (error) {
    console.error("\n❌ Error generating logos:", error);
    process.exit(1);
  }
}

main();
