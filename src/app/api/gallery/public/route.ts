import { NextResponse } from "next/server";
import { gallery as staticGallery } from "@/data/images";
import { db } from "@/lib/db";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  const staticImages = staticGallery.map((item) => ({
    src: `${siteUrl}${item.src}`,
    alt: item.alt,
  }));

  let dynamicImages: { src: string; alt: string }[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const items = await db.gallery.list();
      dynamicImages = items.map((i) => ({ src: i.src, alt: i.alt }));
    } catch {
      // Supabase unavailable — return static images only
    }
  }

  return NextResponse.json([...staticImages, ...dynamicImages]);
}
