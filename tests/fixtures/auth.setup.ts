import { test as setup, expect } from "@playwright/test";
import { ADMIN_AUTH, STAFF_AUTH } from "../../playwright.config";

const ADMIN_USER = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASS = process.env.ADMIN_PASSWORD ?? "";
const STAFF_USER = process.env.STAFF_USERNAME ?? "staff";
const STAFF_PASS = process.env.STAFF_PASSWORD ?? "";

setup("save admin session", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("your username").fill(ADMIN_USER);
  await page.getByPlaceholder("••••••••").fill(ADMIN_PASS);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/admin/);
  await page.context().storageState({ path: ADMIN_AUTH });
});

setup("save staff session", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("your username").fill(STAFF_USER);
  await page.getByPlaceholder("••••••••").fill(STAFF_PASS);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/staff/);
  await page.context().storageState({ path: STAFF_AUTH });
});
