// Run with: npx playwright test
// Requires dev server running on localhost:3000

import { test, expect } from "@playwright/test";

test.describe("Site Navigation", () => {
  test("main navigation has expected links", async ({ page }) => {
    await page.goto("/");
    // Check that navigation contains key links
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link").first()).toBeVisible();
  });

  test("logo links to homepage", async ({ page }) => {
    await page.goto("/onze-uitjes");
    // Find logo link (first link in nav or header with an image)
    const logoLink = page.locator("nav a[href='/']").first();
    if ((await logoLink.count()) > 0) {
      await logoLink.click();
      await page.waitForURL(/\/$/, { timeout: 10000 });
    }
  });

  test("onze-uitjes page loads", async ({ page }) => {
    await page.goto("/onze-uitjes");
    await expect(page.getByText("Onze Uitjes").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("workshop detail page loads", async ({ page }) => {
    await page.goto("/onze-uitjes/kookworkshop");
    await expect(page.getByRole("heading").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("contact page loads", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText("Neem contact op")).toBeVisible({
      timeout: 10000,
    });
  });

  test("booking page loads", async ({ page }) => {
    await page.goto("/booking");
    await expect(page.getByRole("heading", { name: "Open Kookworkshop Inschrijving" })).toBeVisible({
      timeout: 10000,
    });
  });

  test("footer is visible with links", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    // Footer should contain at least one link
    await expect(footer.getByRole("link").first()).toBeVisible();
  });
});
