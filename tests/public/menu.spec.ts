import { test, expect } from "@playwright/test";

test.describe("Menu page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/menu");
  });

  test("page title contains Menu", async ({ page }) => {
    await expect(page).toHaveTitle(/Menu/);
  });

  test("two service tabs are present", async ({ page }) => {
    // Section titles: "The Pub Kitchen" and "The Day Café"
    await expect(page.getByText(/pub kitchen/i).first()).toBeVisible();
    await expect(page.getByText(/day café/i).first()).toBeVisible();
  });

  test("at least one dish name and price visible", async ({ page }) => {
    // Prices start with £
    const priceEl = page.locator("text=/£\\d/").first();
    await expect(priceEl).toBeVisible();
  });

  test("switching to Café Kitchen tab shows café content", async ({ page }) => {
    const cafeTab = page.getByRole("button", { name: /day café/i }).first();
    await cafeTab.click();
    // After switching to the café tab, the Breakfast category becomes visible
    await expect(page.locator("text=/breakfast/i").first()).toBeVisible({ timeout: 5_000 });
  });

  test("switching back to Pub Kitchen tab shows pub content", async ({ page }) => {
    const cafeTab = page.getByRole("button", { name: /day café/i }).first();
    await cafeTab.click();
    const pubTab = page.getByRole("button", { name: /pub kitchen/i }).first();
    await pubTab.click();
    await expect(page.locator("text=/pub kitchen/i").first()).toBeVisible();
  });

  test("tag legend is visible", async ({ page }) => {
    // Tag legend shows V, Hot, Signature, New labels somewhere on page
    const page_text = await page.content();
    const hasLegend = /vegetarian|signature|spicy/i.test(page_text);
    expect(hasLegend).toBe(true);
  });
});
