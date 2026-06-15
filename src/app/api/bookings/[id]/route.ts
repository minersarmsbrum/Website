import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import type { BookingStatus } from "@/lib/store";
import { notifyBookingStatusChange } from "@/lib/notifications";

async function requireAdmin() {
  const session = await getSession();
  return session.role === "admin" ? session : null;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();

  // Status update
  if ("status" in body) {
    const VALID_STATUSES: BookingStatus[] = ["confirmed", "cancelled"];
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const updated = await db.bookings.updateStatus(id, body.status as BookingStatus);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    notifyBookingStatusChange(updated).catch((err) =>
      console.error("[api/bookings/[id]] Notification failed:", err)
    );
    return NextResponse.json(updated);
  }

  // Detail update (date, time, guests)
  const { date, time, guests } = body;
  const updated = await db.bookings.updateDetails(id, {
    ...(date !== undefined && { date }),
    ...(time !== undefined && { time }),
    ...(guests !== undefined && { guests: Number(guests) }),
  });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const ok = await db.bookings.delete(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
