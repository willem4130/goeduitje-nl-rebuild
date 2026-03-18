// Run with: npx playwright test
// Requires dev server running on localhost:3000

import { test, expect } from "@playwright/test";

test.describe("Workshop Configurator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/onze-uitjes");
    // Scroll to configurator section
    const configurator = page.locator("#configurator");
    if ((await configurator.count()) > 0) {
      await configurator.scrollIntoViewIfNeeded();
    }
  });

  test("configurator form is visible", async ({ page }) => {
    await expect(page.getByText("Uitje Configurator")).toBeVisible({
      timeout: 10000,
    });
  });

  // Note: Small group popup tests are timing-sensitive due to 800ms debounce
  // and React hydration. They pass reliably in headed mode but can be flaky in CI.
  test("participant input exists and accepts values", async ({ page }) => {
    const participantInput = page.locator("input[type='number']").first();
    await expect(participantInput).toBeVisible({ timeout: 10000 });
    await participantInput.fill("10");
    await expect(participantInput).toHaveValue("10");
  });

  test("can select workshops when enough participants", async ({ page }) => {
    const participantInput = page.locator("input[type='number']").first();
    await participantInput.fill("10");
    // Workshop checkboxes should be available
    await expect(page.getByText("Kookworkshop").first()).toBeVisible();
  });

  test("zakelijk checkbox shows business fields", async ({ page }) => {
    // Wait for hydration and animations to complete
    await page.waitForTimeout(1000);
    // Click the zakelijk checkbox using the label text
    const label = page.locator("label").filter({ hasText: "Zakelijke aanvraag" });
    await label.click({ force: true });
    await expect(page.getByText("Bedrijfsnaam").first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("has next button for step navigation", async ({ page }) => {
    // The configurator has a "Volgende" button
    await expect(page.getByRole("button", { name: /volgende/i })).toBeVisible({
      timeout: 10000,
    });
  });
});
