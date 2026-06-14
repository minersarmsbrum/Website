import { NextRequest, NextResponse } from "next/server";
import { notifyContactForm } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name?.trim() || !email?.trim() || !EMAIL_RE.test(email) || !message?.trim()) {
    return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
  }

  await notifyContactForm({ name, email, subject: subject ?? "General enquiry", message });

  return NextResponse.json({ ok: true });
}
