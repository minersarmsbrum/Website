import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

async function requireAdmin() {
  const session = await getSession();
  return session.role === "admin" ? session : null;
}

type Ctx = { params: Promise<{ sectionId: string; catId: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { sectionId, catId } = await params;
  const data = await req.json();
  const cat = await db.menu.updateCategory(sectionId, catId, data);
  if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(cat);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { sectionId, catId } = await params;
  const ok = await db.menu.deleteCategory(sectionId, catId);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
