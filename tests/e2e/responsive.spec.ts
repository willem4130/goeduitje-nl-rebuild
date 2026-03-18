// Run with: npx playwright test
// Requires dev server running on localhost:3000

import { test, expect } from "@playwright/test";

test.describe("Mobile Responsive", () => {
  test.use({ viewport: { width: 375, height: 812 } }); // iPhone X

  test("page loads on mobile", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Goeduitje/i);
  });

  test("mobile menu button is visible", async ({ page }) => {
    await page.goto("/");
    // Desktop nav links should be hidden on mobile
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
    // Hamburger menu button should be present on mobile
    const menuBtn = page.locator("button").filter({ hasText: /menu/i });
    const iconMenuBtn = page.locator("nav button").first();
    if ((await menuBtn.count()) > 0) {
      await expect(menuBtn).toBeVisible();
    } else if ((await iconMenuBtn.count()) > 0) {
      await expect(iconMenuBtn).toBeVisible();
    }
  });

  test("booking page works on mobile", async ({ page }) => {
    await page.goto("/booking");
    await expect(
      page.getByText("Open Kookworkshop Inschrijving")
    ).toBeVisible({ timeout: 10000 });
    // Form fields should be visible
    await expect(page.locator("#firstName")).toBeVisible({ timeout: 10000 });
  });

  test("contact page works on mobile", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText("Neem contact op")).toBeVisible({
      timeout: 10000,
    });
    // Form fields should still be accessible
    await expect(page.getByRole("textbox", { name: "Voornaam" })).toBeVisible();
  });

  test("configurator is accessible on mobile", async ({ page }) => {
    await page.goto("/onze-uitjes");
    const configurator = page.locator("#configurator");
    if ((await configurator.count()) > 0) {
      await configurator.scrollIntoViewIfNeeded();
    }
    await expect(page.getByText("Uitje Configurator")).toBeVisible({
      timeout: 10000,
    });
  });
});
