import { test, expect } from "@playwright/test";

const ADMIN_USER = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASS = process.env.ADMIN_PASSWORD ?? "";
const STAFF_USER = process.env.STAFF_USERNAME ?? "staff";
const STAFF_PASS = process.env.STAFF_PASSWORD ?? "";

test.describe("GET /api/auth/me", () => {
  test("returns null role when no session", async ({ request }) => {
    const res = await request.get("/api/auth/me");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.role).toBeNull();
    expect(body.username).toBeNull();
  });
});

test.describe("POST /api/auth/login", () => {
  test("rejects wrong credentials", async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      data: { username: "wrong", password: "wrong" },
    });
    expect(res.status()).toBe(401);
  });

  test("accepts admin credentials and returns admin role", async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      data: { username: ADMIN_USER, password: ADMIN_PASS },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.role).toBe("admin");
  });

  test("accepts staff credentials and returns staff role", async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      data: { username: STAFF_USER, password: STAFF_PASS },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.role).toBe("staff");
  });
});

test.describe("POST /api/auth/logout", () => {
  test("returns ok", async ({ request }) => {
    const res = await request.post("/api/auth/logout");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});
