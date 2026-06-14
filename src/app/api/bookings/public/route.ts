import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifyNewBooking } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  const { name, email, phone, date, time, guests, notes } = await req.json();

  if (!name || !email || !phone || !date || !time || !guests || Number(guests) < 1) {
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
    guests: Number(guests),
    notes: notes ?? "",
  });

  notifyNewBooking(booking).catch((err) =>
    console.error("[api/bookings/public] Notification failed:", err)
  );

  return NextResponse.json(booking, { status: 201 });
}
