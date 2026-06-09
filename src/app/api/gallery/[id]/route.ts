import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { store } from "@/lib/store";
import { createClient } from "@supabase/supabase-js";

async function requireAdmin() {
  const session = await getSession();
  return session.role === "admin" ? session : null;
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const removed = store.gallery.delete(id);
  if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (removed.storagePath && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    await sb.storage.from("gallery").remove([removed.storagePath]);
  }

  return NextResponse.json({ ok: true });
}
