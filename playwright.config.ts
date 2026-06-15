import { defineConfig, devices } from "@playwright/test";
import path from "path";
import { readFileSync } from "fs";

// Playwright does not load .env.local automatically — that's a Next.js dev-server feature.
// Parse it manually so ADMIN_USERNAME/PASSWORD/STAFF_USERNAME/PASSWORD are available
// in the test process (needed by tests/fixtures/auth.setup.ts).
function loadEnvLocal() {
  try {
    const content = readFileSync(path.join(__dirname, ".env.local"), "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (key && !process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env.local doesn't exist — credentials must come from the environment
  }
}
loadEnvLocal();

const BASE_URL = "http://localhost:3000";

export const ADMIN_AUTH = path.join(__dirname, "tests/.auth/admin.json");
export const STAFF_AUTH = path.join(__dirname, "tests/.auth/staff.json");

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    actionTimeout: 10_000,
  },

  projects: [
    // ── Auth setup (runs first, saves cookies) ──────────────────────────────
    {
      name: "auth-setup",
      testMatch: /fixtures\/auth\.setup\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },

    // ── Public & API tests (no auth) ────────────────────────────────────────
    {
      name: "public-and-api",
      testMatch: [/public\/.*\.spec\.ts/, /api\/.*\.spec\.ts/],
      use: { ...devices["Desktop Chrome"] },
    },

    // ── Admin portal tests ──────────────────────────────────────────────────
    {
      name: "admin",
      testMatch: /admin\/.*\.spec\.ts/,
      dependencies: ["auth-setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: ADMIN_AUTH,
      },
    },

    // ── Staff portal tests ──────────────────────────────────────────────────
    {
      name: "staff",
      testMatch: /staff\/.*\.spec\.ts/,
      dependencies: ["auth-setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: STAFF_AUTH,
      },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
