import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifyNewBooking } from "@/lib/notifications";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "anonymous";
  const { allowed } = rateLimit(`bookings:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const { name, email, phone, date, time, guests, notes } = await req.json();

  const guestsNum = Number(guests);
  if (!name || !email || !phone || !date || !time || !guests || guestsNum < 1 || guestsNum > 20) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const today = new Date().toISOString().split("T")[0];
  if (date < today) {
    return NextResponse.json({ error: "Booking date must be today or in the future" }, { status: 400 });
  }

  const booking = await db.bookings.add({
    name,
    email,
    phone,
    date,
    time,
    guests: guestsNum,
    notes: notes ?? "",
  });

  notifyNewBooking(booking).catch((err) =>
    console.error("[api/bookings/public] Notification failed:", err)
  );

  return NextResponse.json(booking, { status: 201 });
}
