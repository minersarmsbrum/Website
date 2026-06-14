import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

async function requireAdmin() {
  const session = await getSession();
  return session.role === "admin" ? session : null;
}

type Ctx = { params: Promise<{ sectionId: string; catId: string; itemId: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { sectionId, catId, itemId } = await params;
  const data = await req.json();
  const item = await db.menu.updateItem(sectionId, catId, itemId, data);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { sectionId, catId, itemId } = await params;
  const ok = await db.menu.deleteItem(sectionId, catId, itemId);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
