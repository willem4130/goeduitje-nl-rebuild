// Run with: npx playwright test
// Requires dev server running on localhost:3000

import { test, expect } from "@playwright/test";

test.describe("Contact Page", () => {
  test("contact form is visible", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText("Neem contact op")).toBeVisible({
      timeout: 10000,
    });
  });

  test("form validation works - empty submit shows errors", async ({
    page,
  }) => {
    await page.goto("/contact");
    // Click submit without filling any fields
    const submitBtn = page.getByRole("button", { name: /verstuur/i });
    await submitBtn.click();
    // Should show validation messages (from zod schema: "minimaal 2 karakters")
    await expect(page.getByText(/minimaal/i).first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("form fields accept input", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("textbox", { name: "Voornaam" }).fill("Test");
    await page.getByRole("textbox", { name: "Achternaam" }).fill("User");
    await page.getByRole("textbox", { name: "E-mail" }).fill("test@test.nl");
    await page
      .getByRole("textbox", { name: "Bericht" })
      .fill("Dit is een test bericht voor het formulier");
  });

  test("has contact info links", async ({ page }) => {
    await page.goto("/contact");
    // Check for phone and email links
    await expect(page.getByRole("link", { name: /06 5267/i })).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.getByRole("link", { name: /info@goeduitje/i }).first()
    ).toBeVisible();
  });

  test("has link to configurator", async ({ page }) => {
    await page.goto("/contact");
    await expect(
      page.getByRole("link", { name: /uitjes configurator/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("form submits successfully and shows toast", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("textbox", { name: "Voornaam" }).fill("Test");
    await page.getByRole("textbox", { name: "Achternaam" }).fill("Gebruiker");
    await page.getByRole("textbox", { name: "E-mail" }).fill("test@test.nl");
    await page
      .getByRole("textbox", { name: "Bericht" })
      .fill("Dit is een automatisch testbericht vanuit Playwright.");
    // Submit the form
    const submitBtn = page.getByRole("button", { name: /verstuur/i });
    await submitBtn.click();
    // Verify success toast appears
    await expect(page.getByText("Bericht verzonden!")).toBeVisible({
      timeout: 10000,
    });
  });
});
