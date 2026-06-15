import { test, expect } from "@playwright/test";

test.describe("GET /api/menu", () => {
  test("returns 200 with menu sections array", async ({ request }) => {
    const res = await request.get("/api/menu");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(2);
  });

  test("each section has title and categories array", async ({ request }) => {
    const res = await request.get("/api/menu");
    const sections = await res.json();
    for (const section of sections) {
      expect(typeof section.title).toBe("string");
      expect(section.title.length).toBeGreaterThan(0);
      expect(Array.isArray(section.categories)).toBe(true);
    }
  });

  test("each category has title and items array", async ({ request }) => {
    const res = await request.get("/api/menu");
    const sections = await res.json();
    for (const section of sections) {
      for (const cat of section.categories) {
        expect(typeof cat.title).toBe("string");
        expect(Array.isArray(cat.items)).toBe(true);
      }
    }
  });

  test("at least one item has name and price", async ({ request }) => {
    const res = await request.get("/api/menu");
    const sections = await res.json();
    const allItems = sections.flatMap((s: { categories: { items: unknown[] }[] }) =>
      s.categories.flatMap((c) => c.items)
    );
    expect(allItems.length).toBeGreaterThan(0);
    const first = allItems[0] as { name: string; price: string };
    expect(typeof first.name).toBe("string");
    expect(typeof first.price).toBe("string");
  });
});
