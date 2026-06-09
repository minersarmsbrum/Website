import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { store } from "@/lib/store";

export async function GET() {
  const session = await getSession();
  if (!session.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(store.bookings.list());
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const data = await req.json();
  const booking = store.bookings.add(data);
  return NextResponse.json(booking, { status: 201 });
}
