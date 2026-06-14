import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { serverClient } from "@/lib/supabase";

async function requireAdmin() {
  const session = await getSession();
  return session.role === "admin" ? session : null;
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const removed = await db.gallery.delete(id);
  if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (removed.storagePath) {
    await serverClient().storage.from("gallery").remove([removed.storagePath]);
  }

  return NextResponse.json({ ok: true });
}
