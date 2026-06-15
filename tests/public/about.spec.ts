import { test, expect } from "@playwright/test";

test.describe("About page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about");
  });

  test("page title contains About", async ({ page }) => {
    await expect(page).toHaveTitle(/About/);
  });

  test("page header / h1 is visible", async ({ page }) => {
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("founder story section rendered", async ({ page }) => {
    // About page has a narrative section; look for key text
    await expect(page.getByText(/began|story|founded|2015/i).first()).toBeVisible();
  });

  test("values grid has multiple items", async ({ page }) => {
    // The 4-column values grid - look for known value headings
    const valueKeywords = ["fresh", "generous", "welcome", "cuisine"];
    let found = 0;
    for (const kw of valueKeywords) {
      const el = page.getByText(new RegExp(kw, "i")).first();
      if (await el.isVisible().catch(() => false)) found++;
    }
    expect(found).toBeGreaterThanOrEqual(2);
  });

  test("navigation links still work from about page", async ({ page }) => {
    // Wait for page animations to settle before clicking navbar links
    await page.waitForLoadState("networkidle");
    await page.getByRole("link", { name: /menu/i }).first().click();
    await expect(page).toHaveURL(/\/menu/, { timeout: 15_000 });
  });
});
