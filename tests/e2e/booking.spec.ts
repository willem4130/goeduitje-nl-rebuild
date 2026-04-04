// Run with: npx playwright test
// Requires dev server running on localhost:3000

import { test, expect } from "@playwright/test";

test.describe("Booking Page", () => {
  test("booking page loads with header", async ({ page }) => {
    await page.goto("/booking");
    await expect(page.getByText("Open Kookworkshop Inschrijving")).toBeVisible({
      timeout: 10000,
    });
  });

  test("shows price badge", async ({ page }) => {
    await page.goto("/booking");
    await expect(page.getByText("€50 p.p.")).toBeVisible({ timeout: 10000 });
  });

  test("has workshop date cards", async ({ page }) => {
    await page.goto("/booking");
    await expect(page.getByText("Kies een datum")).toBeVisible({
      timeout: 10000,
    });
  });

  test("can select a workshop date", async ({ page }) => {
    await page.goto("/booking");
    // Click on first date card button
    const dateCards = page
      .locator("button")
      .filter({ hasText: /JAN|FEB|MRT|APR|MEI|JUN|JUL|AUG|SEP|OKT|NOV|DEC/ });
    if ((await dateCards.count()) > 0) {
      await dateCards.first().click();
    }
  });

  test("booking form has required fields", async ({ page }) => {
    await page.goto("/booking");
    await expect(page.locator("#firstName")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("#lastName")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#numberOfPeople")).toBeVisible();
  });

  test("has dietary requirements options", async ({ page }) => {
    await page.goto("/booking");
    await expect(page.getByText("Dieetwensen")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Vegetarisch")).toBeVisible();
    await expect(page.getByText("Veganistisch")).toBeVisible();
  });

  test("gift card section toggles", async ({ page }) => {
    await page.goto("/booking");
    const giftCardToggle = page.getByText("Ik heb een cadeaubon");
    await expect(giftCardToggle).toBeVisible({ timeout: 10000 });
    await giftCardToggle.click();
    await expect(page.locator("#giftCardId")).toBeVisible({ timeout: 3000 });
    await expect(page.locator("#giftCardValue")).toBeVisible();
  });

  test("sidebar shows what is included", async ({ page }) => {
    await page.goto("/booking");
    await expect(page.getByText("Wat krijg je?")).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.getByText("Alle ingrediënten en materialen")
    ).toBeVisible();
  });

  test("gift card fields appear when checkbox is checked", async ({ page }) => {
    await page.goto("/open-kookworkshops");
    const giftCardToggle = page.getByText("Ik heb een cadeaubon");
    await expect(giftCardToggle).toBeVisible({ timeout: 10000 });
    await giftCardToggle.click();
    await expect(page.locator("#giftCardId")).toBeVisible({ timeout: 3000 });
    await expect(page.locator("#giftCardValue")).toBeVisible();
  });

  test("gift card fields hidden when checkbox unchecked", async ({ page }) => {
    await page.goto("/open-kookworkshops");
    const giftCardToggle = page.getByText("Ik heb een cadeaubon");
    await expect(giftCardToggle).toBeVisible({ timeout: 10000 });
    // Check the gift card checkbox
    await giftCardToggle.click();
    await expect(page.locator("#giftCardId")).toBeVisible({ timeout: 3000 });
    // Uncheck the gift card checkbox
    await giftCardToggle.click();
    await expect(page.locator("#giftCardId")).toBeHidden({ timeout: 3000 });
    await expect(page.locator("#giftCardValue")).toBeHidden();
  });
});
