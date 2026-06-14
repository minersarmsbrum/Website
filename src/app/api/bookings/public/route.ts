import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { notifyNewBooking } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  const { name, email, phone, date, time, guests, notes } = await req.json();

  if (!name || !email || !phone || !date || !time || !guests) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const booking = store.bookings.add({
    name,
    email,
    phone,
    date,
    time,
    guests: Number(guests),
    notes: notes ?? "",
  });

  // Fire-and-forget — don't block the response
  notifyNewBooking(booking).catch((err) =>
    console.error("[api/bookings/public] Notification failed:", err)
  );

  return NextResponse.json(booking, { status: 201 });
}
