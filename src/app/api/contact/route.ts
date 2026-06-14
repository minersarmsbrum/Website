import { NextRequest, NextResponse } from "next/server";
import { notifyContactForm } from "@/lib/notifications";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "anonymous";
  const { allowed } = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const { name, email, subject, message } = await req.json();

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name?.trim() || !email?.trim() || !EMAIL_RE.test(email) || !message?.trim()) {
    return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
  }

  await notifyContactForm({ name, email, subject: subject ?? "General enquiry", message });

  return NextResponse.json({ ok: true });
}
