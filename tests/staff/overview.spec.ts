import { test, expect } from "@playwright/test";

test.describe("Staff Overview", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/staff");
  });

  test("stays on /staff (not redirected to login)", async ({ page }) => {
    await expect(page).toHaveURL(/\/staff$/);
  });

  test("Staff Portal heading is visible", async ({ page }) => {
    await expect(page.getByText(/staff portal/i).first()).toBeVisible();
  });

  test("Today's bookings stat card is visible", async ({ page }) => {
    await expect(page.getByText(/today.*bookings|bookings.*today/i)).toBeVisible();
  });

  test("Confirmed bookings stat card is visible (not Pending confirmation)", async ({ page }) => {
    await expect(page.getByText(/confirmed bookings/i)).toBeVisible();
    await expect(page.getByText(/pending confirmation/i)).not.toBeVisible();
  });

  test("Total bookings stat card is visible", async ({ page }) => {
    await expect(page.getByText(/total bookings/i)).toBeVisible();
  });

  test("View All Bookings link navigates to /staff/bookings", async ({ page }) => {
    await page.getByRole("link", { name: /view all bookings/i }).click();
    await expect(page).toHaveURL(/\/staff\/bookings/);
  });

  test("sign out button is present", async ({ page }) => {
    await expect(page.getByRole("button", { name: /sign out|logout/i })).toBeVisible();
  });

  test("signing out redirects away from /staff", async ({ page }) => {
    await page.getByRole("button", { name: /sign out|logout/i }).click();
    await expect(page).not.toHaveURL(/\/staff$/);
  });

  test("staff cannot access /admin (redirected to login)", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });
});
