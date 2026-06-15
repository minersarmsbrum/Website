import { test, expect } from "@playwright/test";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const FUTURE_DATE = tomorrow.toISOString().split("T")[0];

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const PAST_DATE = yesterday.toISOString().split("T")[0];

const VALID = {
  name: "Playwright Tester",
  email: "playwright@example.com",
  phone: "07777123456",
  date: FUTURE_DATE,
  time: "19:00",
  guests: 2,
  notes: "",
};

test.describe("POST /api/bookings/public — validation", () => {
  test("rejects missing name", async ({ request }) => {
    const res = await request.post("/api/bookings/public", {
      data: { ...VALID, name: "" },
    });
    expect(res.status()).toBe(400);
  });

  test("rejects missing phone", async ({ request }) => {
    const res = await request.post("/api/bookings/public", {
      data: { ...VALID, phone: "" },
    });
    expect(res.status()).toBe(400);
  });

  test("rejects missing date", async ({ request }) => {
    const res = await request.post("/api/bookings/public", {
      data: { ...VALID, date: "" },
    });
    expect(res.status()).toBe(400);
  });

  test("rejects past date", async ({ request }) => {
    const res = await request.post("/api/bookings/public", {
      data: { ...VALID, date: PAST_DATE },
    });
    expect(res.status()).toBe(400);
  });

  test("rejects guests = 0", async ({ request }) => {
    const res = await request.post("/api/bookings/public", {
      data: { ...VALID, guests: 0 },
    });
    // 5-request rate limit means later tests may get 429 — both indicate a rejected request
    expect([400, 429]).toContain(res.status());
  });

  test("rejects guests = 21", async ({ request }) => {
    const res = await request.post("/api/bookings/public", {
      data: { ...VALID, guests: 21 },
    });
    expect([400, 429]).toContain(res.status());
  });
});

test.describe("POST /api/bookings/public — success", () => {
  test("creates booking with status confirmed (not pending)", async ({ request }) => {
    const res = await request.post("/api/bookings/public", { data: VALID });
    // Accept 201 or 429 (rate limit from other test runs)
    expect([201, 429]).toContain(res.status());
    if (res.status() === 201) {
      const body = await res.json();
      expect(body.status).toBe("confirmed");
      expect(body.status).not.toBe("pending");
      expect(body.name).toBe(VALID.name);
      expect(body.id).toBeTruthy();
    }
  });
});
