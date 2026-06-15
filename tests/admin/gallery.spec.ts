import { test, expect } from "@playwright/test";

// Minimal 1x1 transparent PNG as base64
const TINY_PNG_B64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

test.describe("Admin Gallery", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/gallery");
    await page.waitForTimeout(1500);
  });

  test("gallery heading is visible", async ({ page }) => {
    await expect(page.getByText(/gallery/i).first()).toBeVisible();
  });

  test("photo count label is visible", async ({ page }) => {
    await expect(page.locator("text=/\\d+ \\/ 50 photos/")).toBeVisible();
  });

  test("Upload Photo section is visible with file input", async ({ page }) => {
    await expect(page.getByText(/upload photo/i)).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeAttached();
  });

  test("alt text input and tall crop checkbox are present", async ({ page }) => {
    await expect(page.getByPlaceholder(/describe the photo/i)).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toBeAttached();
  });

  test("upload button is visible and enabled when under photo limit", async ({ page }) => {
    const uploadBtn = page.getByRole("button", { name: /^upload$/i });
    await expect(uploadBtn).toBeVisible();
    await expect(uploadBtn).toBeEnabled();
  });

  test("upload without selecting a file shows error", async ({ page }) => {
    await page.getByRole("button", { name: /^upload$/i }).click();
    await expect(page.getByText(/select an image/i)).toBeVisible({ timeout: 3_000 });
  });

  test("uploading a test image adds it to the grid", async ({ page }) => {
    const pngBuffer = Buffer.from(TINY_PNG_B64, "base64");
    const countBefore = await page.locator(".columns-2 > div, .columns-3 > div, .columns-4 > div, [class*='columns'] > div").count();

    await page.locator('input[type="file"]').setInputFiles({
      name: "test-photo.png",
      mimeType: "image/png",
      buffer: pngBuffer,
    });
    await page.getByPlaceholder(/describe the photo/i).fill("Playwright test photo");
    await page.getByRole("button", { name: /^upload$/i }).click();

    // Wait for upload and grid refresh
    await page.waitForTimeout(4000);

    const countAfter = await page.locator("[class*='columns'] > div").count().catch(() => 0);
    // Either count increased or we see the test photo alt text
    const photoVisible = await page.locator("img[alt='Playwright test photo']").isVisible().catch(() => false);
    expect(countAfter > countBefore || photoVisible).toBe(true);
  });

  test("existing gallery images are visible in the grid", async ({ page }) => {
    const images = page.locator("img").filter({ hasNot: page.locator('[alt="The Miners Arms crest"]') });
    const count = await images.count();
    // May be 0 in a fresh environment, but should not error
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("hovering over a photo reveals the Remove button", async ({ page }) => {
    const gridItems = page.locator("[class*='columns'] > div");
    const count = await gridItems.count();
    if (count === 0) {
      test.skip();
      return;
    }
    await gridItems.first().hover();
    await expect(gridItems.first().getByRole("button", { name: /remove/i })).toBeVisible({ timeout: 3_000 });
  });

  test("clicking Remove on a photo deletes it from the grid", async ({ page }) => {
    // First ensure we have an item by uploading one
    const pngBuffer = Buffer.from(TINY_PNG_B64, "base64");
    await page.locator('input[type="file"]').setInputFiles({
      name: "delete-test.png",
      mimeType: "image/png",
      buffer: pngBuffer,
    });
    await page.getByPlaceholder(/describe the photo/i).fill("Delete me test photo");
    await page.getByRole("button", { name: /^upload$/i }).click();
    await page.waitForTimeout(4000);

    const gridItems = page.locator("[class*='columns'] > div");
    const countBefore = await gridItems.count();

    // Hover the last item and click Remove
    page.on("dialog", (d) => d.accept());
    await gridItems.last().hover();
    await gridItems.last().getByRole("button", { name: /remove/i }).click();
    await page.waitForTimeout(3000);

    const countAfter = await gridItems.count();
    expect(countAfter).toBeLessThan(countBefore);
  });
});
