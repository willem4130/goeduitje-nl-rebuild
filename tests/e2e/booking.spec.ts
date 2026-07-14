// Run with: npx playwright test
// Requires dev server running on localhost:3000

import { test, expect } from "@playwright/test";

test.describe("Booking Page", () => {
  test("booking page loads with header", async ({ page }) => {
    await page.goto("/open-kookworkshops");
    await expect(page.getByText("Open Kookworkshop Inschrijving")).toBeVisible({
      timeout: 10000,
    });
  });

  test("old /booking route redirects here", async ({ page }) => {
    await page.goto("/booking");
    await expect(page).toHaveURL(/\/open-kookworkshops/);
  });

  test("shows price badge", async ({ page }) => {
    await page.goto("/open-kookworkshops");
    await expect(page.getByText(/€\d+ p\.p\./)).toBeVisible({
      timeout: 10000,
    });
  });

  test("has workshop date cards", async ({ page }) => {
    await page.goto("/open-kookworkshops");
    await expect(page.getByText("Kies een datum")).toBeVisible({
      timeout: 10000,
    });
  });

  test("date rows show a cuisine badge", async ({ page }) => {
    await page.goto("/open-kookworkshops");
    await expect(page.getByText("Kies een datum")).toBeVisible({
      timeout: 10000,
    });
    // Data-dependent: only assert when there are selectable dates
    const dateRows = page
      .locator("button")
      .filter({
        hasText: /Maandag|Dinsdag|Woensdag|Donderdag|Vrijdag|Zaterdag|Zondag/,
      });
    if ((await dateRows.count()) > 0) {
      await expect(page.getByText(/^(Arabisch|Perzisch)$/).first()).toBeVisible(
        { timeout: 5000 }
      );
    }
  });

  test("can select a workshop date", async ({ page }) => {
    await page.goto("/open-kookworkshops");
    const dateRows = page
      .locator("button")
      .filter({
        hasText: /Maandag|Dinsdag|Woensdag|Donderdag|Vrijdag|Zaterdag|Zondag/,
      });
    if ((await dateRows.count()) > 0) {
      await dateRows.first().click();
      // Collapses to a summary with a "Wijzig" affordance
      await expect(page.getByText("Wijzig")).toBeVisible({ timeout: 5000 });
    }
  });

  test("booking form has required fields", async ({ page }) => {
    await page.goto("/open-kookworkshops");
    await expect(page.locator("#firstName")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("#lastName")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#numberOfPeople")).toBeVisible();
  });

  test("has dietary requirements options", async ({ page }) => {
    await page.goto("/open-kookworkshops");
    await expect(page.getByText("Dieetwensen")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Vegetarisch")).toBeVisible();
    await expect(page.getByText("Veganistisch")).toBeVisible();
  });

  test("has an optional voucher code field", async ({ page }) => {
    await page.goto("/open-kookworkshops");
    await expect(page.getByText("Cadeaubon of kortingscode")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator("#voucherCode")).toBeVisible();
  });

  test("entering a voucher code shows settlement note", async ({ page }) => {
    await page.goto("/open-kookworkshops");
    await expect(page.locator("#numberOfPeople")).toBeVisible({
      timeout: 10000,
    });
    // Price block (and the note inside it) only renders with a people count
    await page.locator("#numberOfPeople").fill("2");
    await page.locator("#voucherCode").fill("GU-2026-TESTX");
    await expect(
      page.getByText(
        "Je cadeaubon of kortingscode wordt verrekend bij de betaling."
      )
    ).toBeVisible({ timeout: 5000 });
  });

  test("sidebar shows what is included", async ({ page }) => {
    await page.goto("/open-kookworkshops");
    await expect(page.getByText("Wat krijg je?")).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.getByText("Alle ingrediënten en materialen")
    ).toBeVisible();
  });
});
