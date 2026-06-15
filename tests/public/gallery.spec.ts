import { test, expect, type Page } from "@playwright/test";

// Gallery items are rendered as <motion.button> wrapping <img>.
// Clicking the button opens the lightbox; lightbox has aria-label nav buttons.
function galleryBtns(page: Page) {
  return page.locator("button").filter({ has: page.locator("img[alt]") });
}

test.describe("Gallery page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/gallery");
    // Wait for gallery buttons (motion.button wrapping img) to be present
    await page.waitForSelector("button img[alt]", { timeout: 10_000 });
  });

  test("page title contains Gallery", async ({ page }) => {
    await expect(page).toHaveTitle(/Gallery/);
  });

  test("at least 6 images rendered in the grid", async ({ page }) => {
    const count = await galleryBtns(page).count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test("clicking a gallery item opens the lightbox", async ({ page }) => {
    await galleryBtns(page).first().click();
    // Lightbox is open when the Close button appears
    await expect(page.getByLabel("Close")).toBeVisible({ timeout: 5_000 });
  });

  test("Escape key closes lightbox", async ({ page }) => {
    await galleryBtns(page).first().click();
    await expect(page.getByLabel("Close")).toBeVisible({ timeout: 5_000 });
    await page.keyboard.press("Escape");
    await expect(page.getByLabel("Close")).not.toBeVisible({ timeout: 3_000 });
  });

  test("counter shows X / Y format in lightbox", async ({ page }) => {
    await galleryBtns(page).first().click();
    await expect(page.getByLabel("Close")).toBeVisible({ timeout: 5_000 });
    const counter = page.locator("text=/\\d+ \\/ \\d+/").first();
    await expect(counter).toBeVisible({ timeout: 3_000 });
    const text = await counter.textContent();
    expect(text).toMatch(/\d+ \/ \d+/);
  });

  test("Next button advances to the second image", async ({ page }) => {
    await galleryBtns(page).first().click();
    await expect(page.getByLabel("Close")).toBeVisible({ timeout: 5_000 });

    const counterBefore = await page.locator("text=/\\d+ \\/ \\d+/").first().textContent();
    await page.getByLabel("Next", { exact: true }).click();
    const counterAfter = await page.locator("text=/\\d+ \\/ \\d+/").first().textContent();
    expect(counterAfter).not.toBe(counterBefore);
  });

  test("Previous button navigates backwards", async ({ page }) => {
    await galleryBtns(page).first().click();
    await expect(page.getByLabel("Close")).toBeVisible({ timeout: 5_000 });
    await page.getByLabel("Next", { exact: true }).click();
    const counterAtTwo = await page.locator("text=/\\d+ \\/ \\d+/").first().textContent();
    await page.getByLabel("Previous", { exact: true }).click();
    const counterAtOne = await page.locator("text=/\\d+ \\/ \\d+/").first().textContent();
    expect(counterAtOne).not.toBe(counterAtTwo);
  });
});
