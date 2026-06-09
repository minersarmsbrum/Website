import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { store } from "@/lib/store";
import { createClient } from "@supabase/supabase-js";

async function requireAdmin() {
  const session = await getSession();
  return session.role === "admin" ? session : null;
}

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  const session = await getSession();
  if (!session.role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(store.gallery.list());
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local" }, { status: 503 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const alt = String(formData.get("alt") || "Gallery image");
  const tall = formData.get("tall") === "true";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const storagePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const sb = supabase();
  const { error: uploadError } = await sb.storage
    .from("gallery")
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: { publicUrl } } = sb.storage.from("gallery").getPublicUrl(storagePath);

  const item = store.gallery.add({ src: publicUrl, alt, tall, storagePath });
  return NextResponse.json(item, { status: 201 });
}
