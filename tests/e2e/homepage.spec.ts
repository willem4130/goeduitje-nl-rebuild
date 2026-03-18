// Run with: npx playwright test
// Requires dev server running on localhost:3000

import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads successfully with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Goeduitje/i);
  });

  test("has navigation with links", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
    // Check for key nav links
    await expect(
      page.getByRole("link", { name: /onze uitjes/i }).first()
    ).toBeVisible();
  });

  test("has footer", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer")).toBeVisible();
  });

  test("hero section is visible with video or image", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("video, img[src*='hero']").first();
    await expect(hero).toBeVisible({ timeout: 10000 });
  });

  test("has configurator section", async ({ page }) => {
    await page.goto("/");
    const configurator = page.locator("#configurator");
    await expect(configurator).toBeVisible();
  });

  test("has CTA button linking to configurator", async ({ page }) => {
    await page.goto("/");
    // Wait for client-side hydration
    await page.waitForTimeout(2000);
    await expect(
      page.getByText(/stel je uitje samen/i).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("has contact CTA section", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText("Heb je vragen?")
    ).toBeVisible({ timeout: 10000 });
  });
});
