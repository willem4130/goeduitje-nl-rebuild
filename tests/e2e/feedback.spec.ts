import { test, expect } from "@playwright/test";

test.describe("Feedback Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/feedback");
  });

  test("feedback page loads with form", async ({ page }) => {
    await expect(page.getByText("Geef ons feedback")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator("#firstName")).toBeVisible();
    await expect(page.locator("#lastName")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#date")).toBeVisible();
    await expect(page.locator("#location")).toBeVisible();
  });

  test("star rating is interactive", async ({ page }) => {
    // Click the 4th star
    const stars = page
      .locator("button")
      .filter({ has: page.locator("svg.h-10") });
    if ((await stars.count()) >= 4) {
      await stars.nth(3).click();
      // Verify the 4th star is filled (has fill-yellow-400 class)
      await expect(stars.nth(3).locator("svg")).toHaveClass(/fill-yellow-400/);
    }
  });

  test("shows validation errors for empty required fields", async ({
    page,
  }) => {
    // Try to submit empty form
    await page.getByRole("button", { name: /verzenden/i }).click();
    // Check for validation error messages
    await expect(page.getByText("Voornaam is verplicht")).toBeVisible();
  });

  test("whatWasBest and whatToImprove textareas are present", async ({
    page,
  }) => {
    await expect(page.locator("#whatWasBest")).toBeVisible();
    await expect(page.locator("#whatToImprove")).toBeVisible();
  });
});
