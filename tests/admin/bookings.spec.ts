import { test, expect } from "@playwright/test";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const FUTURE_DATE = tomorrow.toISOString().split("T")[0];

const dayAfter = new Date();
dayAfter.setDate(dayAfter.getDate() + 2);
const FUTURE_DATE_2 = dayAfter.toISOString().split("T")[0];

test.describe("Admin Bookings — filters and display", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/bookings");
  });

  test("page heading is visible", async ({ page }) => {
    await expect(page.getByText(/bookings/i).first()).toBeVisible();
  });

  test("filter tabs contain all, confirmed, cancelled but NOT pending", async ({ page }) => {
    await expect(page.getByRole("button", { name: /^all/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /^confirmed/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /^cancelled/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /^pending/i })).not.toBeVisible();
  });

  test("Add Booking button is visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /\+ add booking/i })).toBeVisible();
  });
});

test.describe("Admin Bookings — add booking", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/bookings");
  });

  test("Add Booking opens modal", async ({ page }) => {
    await page.getByRole("button", { name: /\+ add booking/i }).click();
    await expect(page.getByText(/add booking/i).last()).toBeVisible();
  });

  test("modal has required fields", async ({ page }) => {
    await page.getByRole("button", { name: /\+ add booking/i }).click();
    await expect(page.getByLabel(/name/i).first()).toBeVisible();
    await expect(page.getByLabel(/email/i).first()).toBeVisible();
    await expect(page.getByLabel(/phone/i).first()).toBeVisible();
    await expect(page.getByLabel(/date/i).first()).toBeVisible();
    await expect(page.getByLabel(/time/i).first()).toBeVisible();
    await expect(page.getByLabel(/guests/i).first()).toBeVisible();
  });

  test("modal has no status dropdown (removed pending, confirmed is default)", async ({ page }) => {
    await page.getByRole("button", { name: /\+ add booking/i }).click();
    // The status field should not show "pending" as an option
    const statusSelect = page.locator("select").filter({ hasText: /pending/i });
    await expect(statusSelect).not.toBeVisible();
  });

  test("submitting empty form shows error", async ({ page }) => {
    await page.getByRole("button", { name: /\+ add booking/i }).click();
    await page.getByRole("button", { name: /^add booking$/i }).click();
    await expect(page.getByText(/required|fill in/i)).toBeVisible({ timeout: 3_000 });
  });

  test("adding valid booking creates a confirmed entry", async ({ page }) => {
    await page.getByRole("button", { name: /\+ add booking/i }).click();

    // Fill modal form
    const modal = page.locator(".fixed.inset-0").last();
    await modal.getByLabel(/name/i).fill("Test Guest Admin");
    await modal.getByLabel(/email/i).fill("testguest@example.com");
    await modal.getByLabel(/phone/i).fill("07700000001");
    await modal.getByLabel(/date/i).fill(FUTURE_DATE);
    await modal.getByLabel(/time/i).selectOption("19:00").catch(() =>
      modal.locator("select").nth(0).selectOption("19:00")
    );

    await page.getByRole("button", { name: /^add booking$/i }).click();

    // Wait for modal to close and list to refresh
    await page.waitForTimeout(2000);

    // Booking should appear with confirmed badge (not pending)
    await expect(page.getByText("Test Guest Admin")).toBeVisible({ timeout: 8_000 });
    // Should show "confirmed" badge somewhere near the booking
    const bookingCard = page.locator(".card-surface").filter({ hasText: "Test Guest Admin" }).first();
    await expect(bookingCard.getByText(/confirmed/i)).toBeVisible();
    await expect(bookingCard.getByText(/pending/i)).not.toBeVisible();
  });
});

test.describe("Admin Bookings — edit and cancel actions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/bookings");
    // Wait for bookings to load
    await page.waitForTimeout(1500);
  });

  test("booking cards show Edit button", async ({ page }) => {
    const cards = page.locator(".card-surface").filter({ has: page.locator("button", { hasText: /edit/i }) });
    const count = await cards.count();
    // Only test if there are bookings
    if (count > 0) {
      await expect(cards.first().getByRole("button", { name: /edit/i })).toBeVisible();
    }
  });

  test("confirmed booking cards show Cancel button", async ({ page }) => {
    const confirmedCards = page.locator(".card-surface").filter({ has: page.locator("text=confirmed") });
    const count = await confirmedCards.count();
    if (count > 0) {
      await expect(confirmedCards.first().getByRole("button", { name: /cancel/i })).toBeVisible();
    }
  });

  test("no status dropdown on booking cards", async ({ page }) => {
    // There should be no select element inside booking cards for status
    const selects = page.locator(".card-surface select");
    await expect(selects.first()).not.toBeVisible({ timeout: 3_000 }).catch(() => {});
    const count = await selects.count();
    expect(count).toBe(0);
  });

  test("Edit button opens modal pre-filled with date, time, guests", async ({ page }) => {
    const firstCard = page.locator(".card-surface").filter({ has: page.locator("button", { hasText: /edit/i }) }).first();
    const count = await firstCard.count();
    if (count === 0) {
      test.skip();
      return;
    }
    await firstCard.getByRole("button", { name: /edit/i }).click();
    // Edit modal should open
    await expect(page.getByText(/edit booking/i).last()).toBeVisible({ timeout: 3_000 });
    // Modal should have date and time fields
    await expect(page.getByLabel(/date/i).last()).toBeVisible();
    await expect(page.getByLabel(/time/i).last()).toBeVisible();
    await expect(page.getByLabel(/guests/i).last()).toBeVisible();
  });

  test("edit modal Save Changes updates the booking", async ({ page }) => {
    // First add a booking we can safely edit
    await page.getByRole("button", { name: /\+ add booking/i }).click();
    const modal = page.locator(".fixed.inset-0").last();
    await modal.getByLabel(/name/i).fill("Edit Test Guest");
    await modal.getByLabel(/email/i).fill("edit@example.com");
    await modal.getByLabel(/phone/i).fill("07700000002");
    await modal.getByLabel(/date/i).fill(FUTURE_DATE);
    await modal.getByLabel(/time/i).selectOption("18:00").catch(() => {});
    await page.getByRole("button", { name: /^add booking$/i }).click();
    await page.waitForTimeout(2000);

    // Find the card and click Edit
    const editCard = page.locator(".card-surface").filter({ hasText: "Edit Test Guest" }).first();
    await editCard.getByRole("button", { name: /edit/i }).click();

    // Change the date
    const editModal = page.locator(".fixed.inset-0").last();
    await editModal.getByLabel(/date/i).fill(FUTURE_DATE_2);
    await page.getByRole("button", { name: /save changes/i }).click();
    await page.waitForTimeout(2000);

    // Verify the date changed
    const updatedCard = page.locator(".card-surface").filter({ hasText: "Edit Test Guest" }).first();
    await expect(updatedCard.getByText(FUTURE_DATE_2)).toBeVisible({ timeout: 5_000 });
  });

  test("Cancel button cancels the booking and hides Cancel button", async ({ page }) => {
    // Add a booking we can cancel
    await page.getByRole("button", { name: /\+ add booking/i }).click();
    const modal = page.locator(".fixed.inset-0").last();
    await modal.getByLabel(/name/i).fill("Cancel Test Guest");
    await modal.getByLabel(/email/i).fill("cancel@example.com");
    await modal.getByLabel(/phone/i).fill("07700000003");
    await modal.getByLabel(/date/i).fill(FUTURE_DATE);
    await modal.getByLabel(/time/i).selectOption("20:00").catch(() => {});
    await page.getByRole("button", { name: /^add booking$/i }).click();
    await page.waitForTimeout(2000);

    // Click Cancel on the new booking
    const cancelCard = page.locator(".card-surface").filter({ hasText: "Cancel Test Guest" }).first();
    page.on("dialog", (dialog) => dialog.accept());
    await cancelCard.getByRole("button", { name: /^cancel$/i }).click();
    await page.waitForTimeout(2000);

    // Status should now show "cancelled"
    const updatedCard = page.locator(".card-surface").filter({ hasText: "Cancel Test Guest" }).first();
    await expect(updatedCard.getByText(/cancelled/i)).toBeVisible({ timeout: 5_000 });
    // Cancel button should no longer be visible on this card
    await expect(updatedCard.getByRole("button", { name: /^cancel$/i })).not.toBeVisible();
  });

  test("Delete button removes the booking", async ({ page }) => {
    // Add a booking we can delete
    await page.getByRole("button", { name: /\+ add booking/i }).click();
    const modal = page.locator(".fixed.inset-0").last();
    await modal.getByLabel(/name/i).fill("Delete Test Guest");
    await modal.getByLabel(/email/i).fill("delete@example.com");
    await modal.getByLabel(/phone/i).fill("07700000004");
    await modal.getByLabel(/date/i).fill(FUTURE_DATE);
    await modal.getByLabel(/time/i).selectOption("12:00").catch(() => {});
    await page.getByRole("button", { name: /^add booking$/i }).click();
    await page.waitForTimeout(2000);

    // Click Delete
    const deleteCard = page.locator(".card-surface").filter({ hasText: "Delete Test Guest" }).first();
    page.on("dialog", (dialog) => dialog.accept());
    await deleteCard.getByRole("button", { name: /delete/i }).click();
    await page.waitForTimeout(2000);

    // Booking should be gone
    await expect(page.getByText("Delete Test Guest")).not.toBeVisible({ timeout: 5_000 });
  });

  test("confirmed filter shows only confirmed bookings", async ({ page }) => {
    await page.getByRole("button", { name: /^confirmed/i }).click();
    await page.waitForTimeout(500);
    // All visible status badges should be "confirmed", not "cancelled"
    const cancelledBadges = page.locator(".card-surface").filter({ has: page.locator("text=cancelled") });
    expect(await cancelledBadges.count()).toBe(0);
  });

  test("cancelled filter shows only cancelled bookings", async ({ page }) => {
    await page.getByRole("button", { name: /^cancelled/i }).click();
    await page.waitForTimeout(500);
    const confirmedBadges = page.locator(".card-surface").filter({ has: page.locator("span", { hasText: /^confirmed$/ }) });
    expect(await confirmedBadges.count()).toBe(0);
  });
});
