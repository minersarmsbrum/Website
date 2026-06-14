import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const bookings = await db.bookings.list();
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name, email, phone, date, time, guests, notes, status } = await req.json();
  const guestsNum = Number(guests);
  if (!name?.trim() || !email?.trim() || !phone?.trim() || !date || !time || !guestsNum || guestsNum < 1 || guestsNum > 20) {
    return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
  }
  const today = new Date().toISOString().split("T")[0];
  if (date < today) {
    return NextResponse.json({ error: "Booking date must be today or in the future" }, { status: 400 });
  }
  const booking = await db.bookings.add({ name, email, phone, date, time, guests: guestsNum, notes: notes ?? "", status });
  return NextResponse.json(booking, { status: 201 });
}
