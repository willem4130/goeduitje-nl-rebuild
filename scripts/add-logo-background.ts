#!/usr/bin/env bun
/**
 * Add a subtle background to navigation logos for better visibility
 */

import sharp from "sharp";
import { join } from "path";

const LOGO_DIR = join(process.cwd(), "public", "images", "logo");

async function addBackgroundToLogo() {
  console.log("Adding background to navigation logos for visibility...\n");

  // Desktop logo - add very light gray background
  const desktopLogo = join(LOGO_DIR, "logo-nav-desktop.png");
  const metadata = await sharp(desktopLogo).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Could not read logo dimensions");
  }

  // Create a light background (very subtle light beige/cream)
  const background = await sharp({
    create: {
      width: metadata.width,
      height: metadata.height,
      channels: 4,
      background: { r: 252, g: 252, b: 250, alpha: 1 }, // Almost white with warm tint
    },
  })
    .png()
    .toBuffer();

  // Composite logo on background
  await sharp(background)
    .composite([
      {
        input: desktopLogo,
        gravity: "center",
      },
    ])
    .toFile(join(LOGO_DIR, "logo-nav-desktop-bg.png"));

  console.log("✓ Created logo-nav-desktop-bg.png");

  // Mobile logo
  const mobileLogo = join(LOGO_DIR, "logo-nav-mobile.png");
  const mobileMetadata = await sharp(mobileLogo).metadata();

  if (!mobileMetadata.width || !mobileMetadata.height) {
    throw new Error("Could not read mobile logo dimensions");
  }

  const mobileBackground = await sharp({
    create: {
      width: mobileMetadata.width,
      height: mobileMetadata.height,
      channels: 4,
      background: { r: 252, g: 252, b: 250, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  await sharp(mobileBackground)
    .composite([
      {
        input: mobileLogo,
        gravity: "center",
      },
    ])
    .toFile(join(LOGO_DIR, "logo-nav-mobile-bg.png"));

  console.log("✓ Created logo-nav-mobile-bg.png");

  console.log("\nDone! Updated navigation to use new logos.");
}

addBackgroundToLogo().catch(console.error);
