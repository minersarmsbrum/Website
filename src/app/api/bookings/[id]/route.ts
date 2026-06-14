import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { store } from "@/lib/store";
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
  const { status } = await req.json();
  const updated = store.bookings.updateStatus(id, status as BookingStatus);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Notify guest on confirmed or cancelled — fire-and-forget
  if (status === "confirmed" || status === "cancelled") {
    notifyBookingStatusChange(updated).catch((err) =>
      console.error("[api/bookings/[id]] Notification failed:", err)
    );
  }

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const ok = store.bookings.delete(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
