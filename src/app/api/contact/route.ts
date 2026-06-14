import { NextRequest, NextResponse } from "next/server";
import { notifyContactForm } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await notifyContactForm({ name, email, subject: subject ?? "General enquiry", message });

  return NextResponse.json({ ok: true });
}
