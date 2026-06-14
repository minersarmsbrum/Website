import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

async function requireAdmin() {
  const session = await getSession();
  return session.role === "admin" ? session : null;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ sectionId: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { sectionId } = await params;
  const { title, blurb } = await req.json();
  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });
  const cat = await db.menu.addCategory(sectionId, { title, blurb });
  if (!cat) return NextResponse.json({ error: "Section not found" }, { status: 404 });
  return NextResponse.json(cat, { status: 201 });
}
