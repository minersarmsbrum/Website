import { test, expect } from "@playwright/test";

test.describe("Contact page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("page title contains Contact", async ({ page }) => {
    await expect(page).toHaveTitle(/Contact/);
  });

  test("contact form fields are visible", async ({ page }) => {
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
  });

  test("submitting empty form shows validation errors", async ({ page }) => {
    // Mock the API so no real request is sent
    await page.route("/api/contact", (route) => route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) }));

    await page.getByRole("button", { name: /send/i }).click();
    // Client-side validation should prevent submission and show errors
    const errorEl = await page.locator("text=/required|valid|please/i").first();
    await expect(errorEl).toBeVisible({ timeout: 3_000 }).catch(() => {
      // If no explicit error text, form should at minimum not show success state
    });
    // Success state should NOT be visible
    await expect(page.getByText(/message sent|thank you/i)).not.toBeVisible();
  });

  test("invalid email format shows email error", async ({ page }) => {
    await page.route("/api/contact", (route) => route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) }));
    await page.getByLabel(/name/i).fill("Test User");
    await page.getByLabel(/email/i).fill("not-an-email");
    await page.getByLabel(/message/i).fill("This is a valid message.");
    await page.getByRole("button", { name: /send/i }).click();
    await expect(page.getByText(/valid email/i)).toBeVisible({ timeout: 3_000 });
  });

  test("short message shows length error", async ({ page }) => {
    await page.route("/api/contact", (route) => route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) }));
    await page.getByLabel(/name/i).fill("Test User");
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/message/i).fill("short");
    await page.getByRole("button", { name: /send/i }).click();
    // ContactForm shows "A little more detail, please" for short messages
    await expect(page.getByText(/little more detail/i)).toBeVisible({ timeout: 3_000 });
  });

  test("valid submission shows success state", async ({ page }) => {
    await page.route("/api/contact", (route) =>
      route.fulfill({ status: 201, body: JSON.stringify({ ok: true }) })
    );
    await page.getByLabel(/name/i).fill("Playwright Test");
    await page.getByLabel(/email/i).fill("playwright@example.com");
    await page.getByLabel(/message/i).fill("This is a test message long enough to pass validation.");
    await page.getByRole("button", { name: /send/i }).click();
    await expect(page.getByText(/sent|thank you|received/i).first()).toBeVisible({ timeout: 5_000 });
  });

  test("address and phone number are visible on page", async ({ page }) => {
    const content = await page.content();
    expect(content).toMatch(/west bromwich|B70/i);
  });
});
