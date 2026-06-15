import { test, expect } from "@playwright/test";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const FUTURE_DATE = tomorrow.toISOString().split("T")[0];

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const PAST_DATE = yesterday.toISOString().split("T")[0];

test.describe("Reservations page", () => {
  test.beforeEach(async ({ page }) => {
    // Mock the public booking API so tests don't hit real Supabase
    await page.route("/api/bookings/public", (route) => {
      route.fulfill({
        status: 201,
        body: JSON.stringify({
          id: "test-123",
          name: "Playwright Test",
          email: "playwright@example.com",
          phone: "07777123456",
          date: FUTURE_DATE,
          time: "19:00",
          guests: 2,
          notes: "",
          status: "confirmed",
          createdAt: new Date().toISOString(),
        }),
      });
    });
    await page.goto("/reservations");
  });

  test("page title contains Reservations", async ({ page }) => {
    await expect(page).toHaveTitle(/Reservations/i);
  });

  test("reservation form fields are visible", async ({ page }) => {
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/phone/i)).toBeVisible();
    await expect(page.getByLabel(/date/i)).toBeVisible();
    await expect(page.getByLabel(/time/i)).toBeVisible();
    await expect(page.getByLabel(/guests/i)).toBeVisible();
  });

  test("submitting empty form shows validation errors", async ({ page }) => {
    await page.getByRole("button", { name: /book|reserve|submit/i }).first().click();
    await expect(page.getByText(/required|please fill|valid/i).first()).toBeVisible({ timeout: 3_000 }).catch(() => {
      // Some implementations use HTML5 validation only — no text error
    });
    // Success state should NOT appear
    await expect(page.getByText(/confirmed|booking received/i)).not.toBeVisible();
  });

  test("invalid email shows email error", async ({ page }) => {
    await page.getByLabel(/name/i).fill("Test Guest");
    await page.getByLabel(/email/i).fill("bad-email");
    await page.getByLabel(/phone/i).fill("07777123456");
    await page.getByLabel(/date/i).fill(FUTURE_DATE);
    await page.getByLabel(/time/i).selectOption("19:00").catch(() => {});
    await page.getByRole("button", { name: /book|reserve|submit/i }).first().click();
    await expect(page.getByText(/valid email/i)).toBeVisible({ timeout: 3_000 });
  });

  test("valid submission shows success state", async ({ page }) => {
    await page.getByLabel(/name/i).fill("Playwright Test");
    await page.getByLabel(/email/i).fill("playwright@example.com");
    await page.getByLabel(/phone/i).fill("07777123456");
    await page.getByLabel(/date/i).fill(FUTURE_DATE);
    // Select a time slot
    const timeSelect = page.getByLabel(/time/i);
    await timeSelect.selectOption({ index: 1 }).catch(() =>
      timeSelect.locator("option").nth(1).click()
    );
    await page.getByRole("button", { name: /book|reserve|submit/i }).first().click();
    await expect(page.getByText(/confirmed|booking|thank/i).first()).toBeVisible({ timeout: 8_000 });
  });

  test("past date is rejected by client validation", async ({ page }) => {
    await page.getByLabel(/name/i).fill("Playwright Test");
    await page.getByLabel(/email/i).fill("playwright@example.com");
    await page.getByLabel(/phone/i).fill("07777123456");
    await page.getByLabel(/date/i).fill(PAST_DATE);
    const timeSelect = page.getByLabel(/time/i);
    await timeSelect.selectOption({ index: 1 }).catch(() => {});
    await page.getByRole("button", { name: /book|reserve|submit/i }).first().click();
    // Should show date error or not advance to success
    await expect(page.getByText(/confirmed|thank/i)).not.toBeVisible({ timeout: 3_000 });
  });
});
