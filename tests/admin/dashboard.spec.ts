import { test, expect } from "@playwright/test";

test.describe("Admin Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin");
  });

  test("stays on /admin (not redirected to login)", async ({ page }) => {
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("dashboard heading is visible", async ({ page }) => {
    await expect(page.getByText(/dashboard/i).first()).toBeVisible();
  });

  test("stat cards are visible", async ({ page }) => {
    await expect(page.getByText(/total bookings/i)).toBeVisible();
    await expect(page.getByText(/confirmed bookings/i)).toBeVisible();
    await expect(page.getByText(/gallery photos/i)).toBeVisible();
    await expect(page.getByText(/menu categories/i)).toBeVisible();
  });

  test("no Pending Bookings stat card (removed)", async ({ page }) => {
    await expect(page.getByText(/pending bookings/i)).not.toBeVisible();
  });

  test("recent bookings table is visible", async ({ page }) => {
    await expect(page.getByText(/recent bookings/i)).toBeVisible();
  });

  test("View all link navigates to /admin/bookings", async ({ page }) => {
    await page.getByRole("link", { name: /view all/i }).click();
    await expect(page).toHaveURL(/\/admin\/bookings/);
  });

  test("quick link to Manage Bookings navigates correctly", async ({ page }) => {
    await page.getByRole("link", { name: /manage bookings/i }).click();
    await expect(page).toHaveURL(/\/admin\/bookings/);
  });

  test("quick link to Manage Gallery navigates correctly", async ({ page }) => {
    await page.getByRole("link", { name: /manage gallery/i }).click();
    await expect(page).toHaveURL(/\/admin\/gallery/);
  });

  test("quick link to Manage Menu navigates correctly", async ({ page }) => {
    await page.getByRole("link", { name: /manage menu/i }).click();
    await expect(page).toHaveURL(/\/admin\/menu/);
  });

  test("admin sidebar navigation is visible", async ({ page }) => {
    await expect(page.getByRole("link", { name: /bookings/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /gallery/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /menu/i }).first()).toBeVisible();
  });

  test("sign out button is present", async ({ page }) => {
    await expect(page.getByRole("button", { name: /sign out|logout/i })).toBeVisible();
  });

  test("signing out redirects to login or home", async ({ page }) => {
    await page.getByRole("button", { name: /sign out|logout/i }).click();
    await expect(page).toHaveURL(/\/login|\//);
    // Should not stay on /admin
    await expect(page).not.toHaveURL(/\/admin$/);
  });
});
