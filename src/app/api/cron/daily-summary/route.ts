import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifyDailyBookingSummary } from "@/lib/notifications";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await db.bookings.list();
  await notifyDailyBookingSummary(bookings);

  return NextResponse.json({ ok: true });
}
