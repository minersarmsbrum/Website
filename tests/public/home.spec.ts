import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page title contains The Miners Arms", async ({ page }) => {
    await expect(page).toHaveTitle(/The Miners Arms/);
  });

  test("hero heading is visible", async ({ page }) => {
    const hero = page.locator("section").first();
    await expect(hero).toBeVisible();
    // At least one h1 or large heading present
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("navbar links are all present", async ({ page }) => {
    await expect(page.getByRole("link", { name: /about/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /menu/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /gallery/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /contact/i }).first()).toBeVisible();
  });

  test("Book a Table nav button navigates to /reservations", async ({ page }) => {
    // The Navbar has a 1.6s entrance animation delay — wait for it to settle
    await expect(page.locator("header")).toBeInViewport({ timeout: 8_000 });
    await page.getByRole("link", { name: /book a table/i }).first().click();
    await expect(page).toHaveURL(/\/reservations/, { timeout: 8_000 });
  });

  test("Reserve a Table hero button navigates to /reservations", async ({ page }) => {
    await page.getByRole("link", { name: /reserve a table/i }).first().click();
    await expect(page).toHaveURL(/\/reservations/);
  });

  test("Explore the Menu button navigates to /menu", async ({ page }) => {
    await page.getByRole("link", { name: /explore the menu/i }).first().click();
    await expect(page).toHaveURL(/\/menu/);
  });

  test("footer is visible", async ({ page }) => {
    // Use contentinfo role to target the site <footer>, not inline <footer> elements in testimonial cards
    const footer = page.getByRole("contentinfo");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
  });

  test("View full gallery link navigates to /gallery", async ({ page }) => {
    const galleryLink = page.getByRole("link", { name: /full gallery/i });
    await galleryLink.scrollIntoViewIfNeeded();
    await galleryLink.click();
    await expect(page).toHaveURL(/\/gallery/);
  });
});

test.describe("Auth guards", () => {
  test("/admin without session redirects to /login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("/staff without session redirects to /login", async ({ page }) => {
    await page.goto("/staff");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("shows login form", async ({ page }) => {
    await expect(page.getByPlaceholder("your username")).toBeVisible();
    await expect(page.getByPlaceholder("••••••••")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("shows error on wrong credentials", async ({ page }) => {
    await page.getByPlaceholder("your username").fill("wronguser");
    await page.getByPlaceholder("••••••••").fill("wrongpass");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });
});
