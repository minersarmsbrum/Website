import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { store } from "@/lib/store";

async function requireAdmin() {
  const session = await getSession();
  return session.role === "admin" ? session : null;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ sectionId: string; catId: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { sectionId, catId } = await params;
  const { name, price, desc, tags } = await req.json();
  if (!name || !price) return NextResponse.json({ error: "name and price required" }, { status: 400 });
  const item = store.menu.addItem(sectionId, catId, { name, price, desc, tags });
  if (!item) return NextResponse.json({ error: "Category not found" }, { status: 404 });
  return NextResponse.json(item, { status: 201 });
}
