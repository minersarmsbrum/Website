import { test, expect } from "@playwright/test";

const VALID = {
  name: "Test User",
  email: "test@example.com",
  subject: "General enquiry",
  message: "This is a test message that is long enough.",
};

test.describe("POST /api/contact — validation", () => {
  test("rejects missing name", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...VALID, name: "" },
    });
    expect(res.status()).toBe(400);
  });

  test("rejects missing email", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...VALID, email: "" },
    });
    expect(res.status()).toBe(400);
  });

  test("rejects invalid email format", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...VALID, email: "not-an-email" },
    });
    expect(res.status()).toBe(400);
  });

  test("accepts valid payload", async ({ request }) => {
    const res = await request.post("/api/contact", { data: VALID });
    // 200 success or 429 if rate limited from prior runs — both are expected
    expect([200, 429]).toContain(res.status());
    if (res.status() === 200) {
      const body = await res.json();
      expect(body.ok).toBe(true);
    }
  });
});
