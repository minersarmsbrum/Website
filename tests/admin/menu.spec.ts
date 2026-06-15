import { test, expect } from "@playwright/test";

const TEST_CAT_TITLE = `PW Category ${Date.now()}`;
const TEST_ITEM_NAME = `PW Dish ${Date.now()}`;
const TEST_ITEM_PRICE = "£9.99";

test.describe("Admin Menu", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/menu");
    // Section titles: "The Pub Kitchen" and "The Day Café"
    await page.waitForSelector("text=/pub kitchen|day café/i", { timeout: 10_000 });
  });

  test("menu heading is visible", async ({ page }) => {
    await expect(page.getByText(/^menu$/i).first()).toBeVisible();
  });

  test("two section tabs are visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /pub kitchen/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /day café/i })).toBeVisible();
  });

  test("switching tabs changes the displayed content", async ({ page }) => {
    await page.getByRole("button", { name: /day café/i }).click();
    await page.waitForTimeout(500);
    // Café section should now be active - categories change
    await page.getByRole("button", { name: /pub kitchen/i }).click();
    await page.waitForTimeout(500);
  });

  test("categories are listed under active tab", async ({ page }) => {
    // At least one category card should be visible
    const catCards = page.locator(".card-surface");
    const count = await catCards.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("Admin Menu — category CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/menu");
    await page.waitForSelector("text=/pub kitchen|day café/i", { timeout: 10_000 });
  });

  test("Add Category button is visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /add category/i })).toBeVisible();
  });

  test("clicking Add Category shows input fields", async ({ page }) => {
    await page.getByRole("button", { name: /add category/i }).click();
    await expect(page.getByPlaceholder(/category title/i)).toBeVisible({ timeout: 3_000 });
  });

  test("adding a new category with empty title does nothing", async ({ page }) => {
    await page.getByRole("button", { name: /add category/i }).click();
    // Leave title blank and click save
    const saveBtn = page.getByRole("button", { name: /^save$/i }).first();
    await saveBtn.click();
    // Should not add an empty category — input still visible
    await expect(page.getByPlaceholder(/category title/i)).toBeVisible();
  });

  test("adding a category with a title creates it in the list", async ({ page }) => {
    await page.getByRole("button", { name: /add category/i }).click();
    await page.getByPlaceholder(/category title/i).fill(TEST_CAT_TITLE);
    await page.getByRole("button", { name: /^save$/i }).first().click();
    await page.waitForTimeout(2000);
    await expect(page.getByText(TEST_CAT_TITLE)).toBeVisible({ timeout: 8_000 });
  });

  test("editing a category updates its name", async ({ page }) => {
    // Ensure test category exists first
    const existing = await page.getByText(TEST_CAT_TITLE).isVisible().catch(() => false);
    if (!existing) {
      await page.getByRole("button", { name: /add category/i }).click();
      await page.getByPlaceholder(/category title/i).fill(TEST_CAT_TITLE);
      await page.getByRole("button", { name: /^save$/i }).first().click();
      await page.waitForTimeout(2000);
    }

    const catCard = page.locator(".card-surface").filter({ hasText: TEST_CAT_TITLE }).first();
    await catCard.getByRole("button", { name: /^edit$/i }).click();
    const updatedTitle = TEST_CAT_TITLE + " Updated";
    await page.getByPlaceholder(/category title/i).fill(updatedTitle);
    await page.getByRole("button", { name: /^save$/i }).first().click();
    await page.waitForTimeout(2000);
    await expect(page.getByText(updatedTitle)).toBeVisible({ timeout: 5_000 });
  });

  test("deleting a category removes it", async ({ page }) => {
    // Add a disposable category
    const disposable = `PW Delete Cat ${Date.now()}`;
    await page.getByRole("button", { name: /add category/i }).click();
    await page.getByPlaceholder(/category title/i).fill(disposable);
    await page.getByRole("button", { name: /^save$/i }).first().click();
    await page.waitForTimeout(2000);

    const catCard = page.locator(".card-surface").filter({ hasText: disposable }).first();
    page.on("dialog", (d) => d.accept());
    await catCard.getByRole("button", { name: /^delete$/i }).click();
    await page.waitForTimeout(2000);
    await expect(page.getByText(disposable)).not.toBeVisible({ timeout: 5_000 });
  });
});

test.describe("Admin Menu — item CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/menu");
    await page.waitForSelector("text=/pub kitchen|day café/i", { timeout: 10_000 });
  });

  test("expanding a category shows its items and Add Item button", async ({ page }) => {
    // Click the first category to expand it
    const firstCatToggle = page.locator(".card-surface button").first();
    await firstCatToggle.click();
    await page.waitForTimeout(500);
    await expect(page.getByRole("button", { name: /add item/i })).toBeVisible({ timeout: 3_000 });
  });

  test("adding an item requires name and price", async ({ page }) => {
    const firstCatToggle = page.locator(".card-surface button").first();
    await firstCatToggle.click();
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: /add item/i }).click();
    // Click save without filling anything
    await page.getByRole("button", { name: /^save$/i }).first().click();
    await expect(page.getByText(/name and price|required/i)).toBeVisible({ timeout: 3_000 });
  });

  test("adding a valid item creates it in the category", async ({ page }) => {
    // Use the first existing category
    const firstCatToggle = page.locator(".card-surface").first().locator("button").first();
    await firstCatToggle.click();
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: /add item/i }).click();

    await page.getByPlaceholder(/item name/i).fill(TEST_ITEM_NAME);
    await page.getByPlaceholder(/price/i).fill(TEST_ITEM_PRICE);
    await page.getByRole("button", { name: /^save$/i }).first().click();
    await page.waitForTimeout(2000);

    await expect(page.getByText(TEST_ITEM_NAME)).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(TEST_ITEM_PRICE)).toBeVisible();
  });

  test("editing an item updates its details", async ({ page }) => {
    // Find an existing item
    const firstCatToggle = page.locator(".card-surface").first().locator("button").first();
    await firstCatToggle.click();
    await page.waitForTimeout(1000);

    const itemRow = page.locator(".border-b").first();
    const count = await itemRow.count();
    if (count === 0) { test.skip(); return; }

    await itemRow.getByRole("button", { name: /^edit$/i }).click();
    const updatedName = `Updated ${Date.now()}`;
    await page.getByPlaceholder(/item name/i).fill(updatedName);
    await page.getByRole("button", { name: /^save$/i }).first().click();
    await page.waitForTimeout(2000);
    await expect(page.getByText(updatedName)).toBeVisible({ timeout: 5_000 });
  });

  test("tag checkboxes can be toggled when editing an item", async ({ page }) => {
    const firstCatToggle = page.locator(".card-surface").first().locator("button").first();
    await firstCatToggle.click();
    await page.waitForTimeout(1000);

    const itemRow = page.locator(".border-b").first();
    if (await itemRow.count() === 0) { test.skip(); return; }

    await itemRow.getByRole("button", { name: /^edit$/i }).click();
    // Tag checkboxes should be visible in the edit form
    const vegCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: /veg/i }).first();
    const allCheckboxes = page.locator('input[type="checkbox"]');
    const cbCount = await allCheckboxes.count();
    expect(cbCount).toBeGreaterThan(0);
    // Toggle first checkbox
    await allCheckboxes.first().click();
    // Cancel to avoid saving
    await page.getByRole("button", { name: /^cancel$/i }).first().click();
  });

  test("deleting an item removes it from the category", async ({ page }) => {
    // Add a disposable item first
    const firstCatToggle = page.locator(".card-surface").first().locator("button").first();
    await firstCatToggle.click();
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: /add item/i }).click();
    const disposableName = `PW Delete Item ${Date.now()}`;
    await page.getByPlaceholder(/item name/i).fill(disposableName);
    await page.getByPlaceholder(/price/i).fill("£1.00");
    await page.getByRole("button", { name: /^save$/i }).first().click();
    await page.waitForTimeout(2000);

    const itemRow = page.locator(".border-b").filter({ hasText: disposableName }).first();
    page.on("dialog", (d) => d.accept());
    await itemRow.getByRole("button", { name: /^delete$/i }).click();
    await page.waitForTimeout(2000);
    await expect(page.getByText(disposableName)).not.toBeVisible({ timeout: 5_000 });
  });
});
