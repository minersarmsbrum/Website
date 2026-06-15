import { test, expect } from "@playwright/test";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const FUTURE_DATE = tomorrow.toISOString().split("T")[0];

test.describe("Staff Bookings — read-only view", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/staff/bookings");
    await page.waitForTimeout(1500);
  });

  test("bookings page heading is visible", async ({ page }) => {
    await expect(page.getByText(/bookings/i).first()).toBeVisible();
  });

  test("filter tabs show all, confirmed, cancelled — NOT pending", async ({ page }) => {
    await expect(page.getByRole("button", { name: /^all/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /^confirmed/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /^cancelled/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /^pending/i })).not.toBeVisible();
  });

  test("Add Booking button is visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /\+ add booking/i })).toBeVisible();
  });

  test("booking cards do NOT show Edit button", async ({ page }) => {
    const cards = page.locator(".card-surface").filter({ has: page.locator("span") });
    const count = await cards.count();
    if (count > 0) {
      // No Edit buttons should exist on any card
      const editButtons = page.locator(".card-surface button", { hasText: /^edit$/i });
      expect(await editButtons.count()).toBe(0);
    }
  });

  test("booking cards do NOT show Cancel button", async ({ page }) => {
    const cancelButtons = page.locator(".card-surface button", { hasText: /^cancel$/i });
    expect(await cancelButtons.count()).toBe(0);
  });

  test("booking cards do NOT show Delete button", async ({ page }) => {
    const deleteButtons = page.locator(".card-surface button", { hasText: /^delete$/i });
    expect(await deleteButtons.count()).toBe(0);
  });

  test("confirmed filter shows only confirmed bookings", async ({ page }) => {
    await page.getByRole("button", { name: /^confirmed/i }).click();
    await page.waitForTimeout(500);
    const cancelledBadges = page.locator(".card-surface span", { hasText: /^cancelled$/ });
    expect(await cancelledBadges.count()).toBe(0);
  });

  test("cancelled filter shows only cancelled bookings", async ({ page }) => {
    await page.getByRole("button", { name: /^cancelled/i }).click();
    await page.waitForTimeout(500);
    const confirmedBadges = page.locator(".card-surface span", { hasText: /^confirmed$/ });
    expect(await confirmedBadges.count()).toBe(0);
  });
});

test.describe("Staff Bookings — add booking", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/staff/bookings");
  });

  test("Add Booking opens modal without a status dropdown", async ({ page }) => {
    await page.getByRole("button", { name: /\+ add booking/i }).click();
    await expect(page.getByText(/add booking/i).last()).toBeVisible();
    // Staff modal must NOT have a status select (auto-confirmed)
    const statusSelect = page.locator(".fixed.inset-0 select").filter({ hasText: /pending|confirmed|cancelled/ });
    expect(await statusSelect.count()).toBe(0);
  });

  test("staff-added booking appears as confirmed, not pending", async ({ page }) => {
    await page.getByRole("button", { name: /\+ add booking/i }).click();

    const modal = page.locator(".fixed.inset-0").last();
    await modal.getByLabel(/name/i).fill("Staff Added Guest");
    await modal.getByLabel(/email/i).fill("staffguest@example.com");
    await modal.getByLabel(/phone/i).fill("07700099001");
    await modal.getByLabel(/date/i).fill(FUTURE_DATE);
    await modal.getByLabel(/time/i).selectOption("17:00").catch(() =>
      modal.locator("select").nth(0).selectOption("17:00")
    );

    await page.getByRole("button", { name: /^add booking$/i }).click();
    await page.waitForTimeout(2500);

    // Booking appears with "confirmed" badge
    const bookingCard = page.locator(".card-surface").filter({ hasText: "Staff Added Guest" }).first();
    await expect(bookingCard).toBeVisible({ timeout: 8_000 });
    await expect(bookingCard.getByText(/confirmed/i)).toBeVisible();
    await expect(bookingCard.getByText(/pending/i)).not.toBeVisible();
  });
});
